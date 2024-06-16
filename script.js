//Объявление класса точки
class Point {
    constructor(x, y, power, color, is_used) {
      this.x = x;
      this.y = y;
      this.power = power;
      this.color = color;
      this.is_used = is_used;
    }
}

//Функция рассчета кривой
function curve(a,B,x) {
    let z = x * 2 - B;
    let q = 0;
    if (-B <= z && z <= 0) {
        q = 1 - Math.pow(z/B+1, 2);
    }
    else if (0 <= z && z <= B) {
        q = Math.pow(z/B-1, 2) - 1;
    }
    else if (B <= z) {
        q = -1;
    }
    return ((q + 1) / 2) * a
}

//Блок объявления переменных
let remove_preset = document.getElementById('remove_preset');
let preset = document.getElementById('preset');
let counter = 0;
let canvas = document.getElementById('canvas');
let points_settings = document.getElementById('points_settings');
const add = document.getElementById('add');
const save = document.getElementById('save');
const load = document.getElementById('load');
let ctx = canvas.getContext('2d');
const width = document.getElementById('canvas').offsetWidth;
const height = document.getElementById('canvas').offsetHeight;
let focus_object = {status: false, object: null, dragged: false, length: 1000};
let object = {status: false, object: null};
const point_cnt = 100;
let curve_points = {};
let storage = {};
let graph = [];
for(i=0;i<point_cnt+1;i++){graph.push({x:(width / point_cnt)*i,y:height/2});}

//Задание параметров канвас
canvas.width = width;
canvas.height = height;

//Добавление новой точки
add.addEventListener('click', function() {
    counter++;
    curve_points[counter] = new Point(Math.round((width / 2) / width * point_cnt), 0, point_cnt/4, '#000', true);
    create_form(curve_points[counter]);
    drawCurve();
});

//Создание формы для точки
function create_form(point){
    let new_form = document.createElement('form');
    new_form.setAttribute('class', 'point_details');
    new_form.setAttribute('id', counter);
    new_form.style.backgroundColor = `${point.color}55`
    points_settings.appendChild(new_form);

    // boxs
    let boxs = document.createElement('div');
    boxs.setAttribute('class', 'boxs');
    new_form.appendChild(boxs);

        let color = document.createElement('input');
        color.setAttribute('type', 'color');
        color.setAttribute('name', 'color');
        color.setAttribute('class', 'color');
        color.setAttribute('value', point.color);
        boxs.appendChild(color);

        let is_used = document.createElement('input');
        is_used.setAttribute('type', 'checkbox');
        is_used.setAttribute('name', 'is_used');
        is_used.setAttribute('class', 'is_used');
        if(point.is_used){
            is_used.setAttribute('checked', 'макароны');
        }
        boxs.appendChild(is_used);

    // sliders
    let sliders = document.createElement('div');
    sliders.setAttribute('class', 'sliders');
    new_form.appendChild(sliders);

        let width_range = document.createElement('input');
        width_range.setAttribute('type', 'range');
        width_range.setAttribute('name', 'width');
        width_range.setAttribute('class', 'width');
        width_range.setAttribute('min', '0');
        width_range.setAttribute('max', width);
        width_range.setAttribute('value', Math.round(point.x * width / point_cnt));
        sliders.appendChild(width_range);

        let width_label = document.createElement('sapn');
        width_label.innerHTML = `частота`;
        sliders.appendChild(width_label);

        let height_range = document.createElement('input');
        height_range.setAttribute('type', 'range');
        height_range.setAttribute('name', 'height');
        height_range.setAttribute('class', 'height');
        height_range.setAttribute('min', -height/2);
        height_range.setAttribute('max', height/2);
        height_range.setAttribute('value', point.y);
        sliders.appendChild(height_range);

        let height_label = document.createElement('sapn');
        height_label.innerHTML = `громкость`;
        sliders.appendChild(height_label);

        let power_range = document.createElement('input');
        power_range.setAttribute('type', 'range');
        power_range.setAttribute('name', 'power');
        power_range.setAttribute('class', 'power');
        power_range.setAttribute('min', '1');
        power_range.setAttribute('max', point_cnt/2);
        power_range.setAttribute('value', point.power);
        power_range.setAttribute('step', '1');
        sliders.appendChild(power_range);

        let power_label = document.createElement('sapn');
        power_label.innerHTML = `добротность`;
        sliders.appendChild(power_label);

    // delete
    let _delete = document.createElement('input');
    _delete.setAttribute('type', 'button');
    _delete.setAttribute('name', 'delete');
    _delete.setAttribute('class', 'delete');
    _delete.setAttribute('value', '-');
    new_form.appendChild(_delete);

    //Добавление слушателей событий формы
    new_form.is_used.addEventListener('input', (event) => {
        change_used(new_form.id, event.target.checked);
    });
    new_form.width.addEventListener('input', (event) => {
        change_width(new_form.id, event.target.value);
    });
    new_form.height.addEventListener('input', (event) => {
        change_height(new_form.id, event.target.value);
    });
    new_form.power.addEventListener('input', (event) => {
        change_power(new_form.id, event.target.value);
    });
    new_form.delete.addEventListener('click', function() {
        delete_point(new_form.id);
        new_form.remove();
    });
    new_form.color.addEventListener('input', (event) => {
        chage_color(new_form.id, event.target.value);
        new_form.style.backgroundColor = `${event.target.value}55`
    });
}

//Функция получения ключа по значению
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

//Функция изенения х координаты точки искривления
function change_width(id, value) {
    curve_points[id].x = Math.round(parseInt(value) / width * point_cnt);
    drawCurve();
}

//Функция изенения у координаты точки искривления
function change_height(id, value){
    curve_points[id].y = parseInt(value);
    drawCurve();
}

//Функция изменения мощности точки искривления
function change_power(id, value){
    curve_points[id].power = value;
    drawCurve();
}

//Функция изменения цвета точки искривления
function chage_color(id, value){
    curve_points[id].color = value;
    drawCurve();
}

//Функция изменения использования точки искривления
function change_used(id, value){
    if(value){
        curve_points[id].is_used = true;
    }
    else{
        curve_points[id].is_used = false;
    }
    drawCurve();
}

//Функция удаления точки искривления
function delete_point(id){
    delete curve_points[id];
    drawCurve();
}

//Функция сохранения настроек
save.addEventListener('click', function() {
    let dialog = document.getElementById('dialog');
    let ok = document.getElementById('ok');
    dialog.setAttribute('open', 'true');
    ok.addEventListener('click', save_settings);
    function save_settings(){
        let name = document.getElementById('name');
        if(name.value == ""){
            alert("Название не может быть пустым");
            ok.removeEventListener('click', save_settings);
        }
        else if(name.value in storage){
            alert("Такое название уже существует");
            ok.removeEventListener('click', save_settings);
        }
        else{
            let option = document.createElement('option');
            option.textContent = name.value;
            option.setAttribute('id', name.value);
            preset.appendChild(option);
            document.getElementById(name.value).selected = true;
            storage[name.value] = JSON.stringify(curve_points);
            dialog.close();
            ok.removeEventListener('click', save_settings);
        }
    }
});

//Функция загрузки настройок
load.addEventListener('click', function() {
    points_settings.innerHTML = "";
    let preset = document.getElementById('preset');
    let name = preset.options[preset.selectedIndex].text;
    if (name == "По умолчанию") {
        curve_points = {};
        counter++;
        curve_points[counter] = new Point(Math.round((width / 2) / width * point_cnt), 0, point_cnt/4, '#000', true);
    }
    else {
        curve_points = JSON.parse(storage[name]);
    }
    let points_list = Object.values(curve_points);
    for(i=0;i<points_list.length;i++){
        create_form(points_list[i]);
    }
    drawCurve();
});

//Функция удаления пресета
remove_preset.addEventListener('click', function() {
    let preset = document.getElementById('preset');
    let name = preset.options[preset.selectedIndex].text;
    if(name == "По умолчанию"){
        alert("Нельзя удалить по умолчанию");
        return;
    }
    delete storage[name];
    preset.removeChild(preset.options[preset.selectedIndex]);
});

//Функция отрисовки кривой
function drawCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#5050ff20";
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for(i=0;i<point_cnt+1;i++){graph[i].y = height/2;}

    let points_list = Object.values(curve_points);

    for(i=0;i<points_list.length;i++){
        if (points_list[i].is_used == false){
            continue;
        }
        let point = points_list[i];
        for (let i = 0; i <= point_cnt; i++) {
            let result = curve(parseFloat(point.y), parseFloat(point.power), Math.abs(point.x - i));
            graph[i].y += result;
        }
    }

    ctx.beginPath();
    
        ctx.moveTo(-2, height+2);
        ctx.lineTo(-2, graph[0].y);
        ctx.lineTo(graph[0].x, graph[0].y);

        for (var i = 1; i < graph.length; i++) {
            var xc = (graph[i-1].x + graph[i].x) / 2;
            ctx.lineTo( graph[i].x, graph[i].y)
        }
        ctx.lineTo(width+2, graph[graph.length-1].y);
        ctx.lineTo(width+2, height+2);

        ctx.stroke();
        ctx.fillStyle = "#2282"
        ctx.fill()
    ctx.closePath();

    for(i=0;i<points_list.length;i++){
        if (points_list[i].is_used == false){
            ctx.fillStyle = `${points_list[i].color}66`;
            ctx.strokeStyle = '#0004'
        }
        else {
            ctx.fillStyle = points_list[i].color;
            ctx.strokeStyle = '#000'
        }
        ctx.beginPath();
            ctx.arc(points_list[i].x/point_cnt*width, points_list[i].y + height/2, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        ctx.closePath();
    }

}

//Функция отслеживания нажатия мыши на точку искривления
canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    if (focus_object.length <= 8) {
        focus_object.dragged = true;
    }
});

//Функция отслеживания нажатия по экрану на точку искривления
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const mouseX = e.changedTouches[0].clientX - canvas.offsetLeft;
    const mouseY = e.changedTouches[0].clientY - canvas.offsetTop;
    focus_object.length = 1000;
    let points_list = Object.values(curve_points);
    for(i=0; i<points_list.length; i++){
        let length = Math.sqrt(Math.pow(points_list[i].x/point_cnt*width - mouseX, 2) + Math.pow(points_list[i].y + height/2 - mouseY, 2));
        if( length <= focus_object.length){
            focus_object.status = true;
            focus_object.length = length;
            focus_object.object = points_list[i];
        }
    }
    if (focus_object.length <= 8) {
        focus_object.dragged = true;
    }
});

//Функция отслеживания перемещения и наведения на точку искривления мышью
canvas.addEventListener('mousemove', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    focus_object.length = 1000;
    let points_list = Object.values(curve_points);
    for(i=0; i<points_list.length; i++){
        let length = Math.sqrt(Math.pow(points_list[i].x/point_cnt*width - mouseX, 2) + Math.pow(points_list[i].y + height/2 - mouseY, 2));
        if( length <= focus_object.length){
            focus_object.status = true;
            focus_object.length = length;
            focus_object.object = points_list[i];
        }
    }
    if(focus_object.status && focus_object.dragged){
        focus_object.object.x = Math.round(parseInt(e.offsetX) / width * point_cnt);
        focus_object.object.y = parseInt(e.offsetY - height/2);
        let form = document.getElementById(getKeyByValue(curve_points, focus_object.object));
        form.width.value = focus_object.object.x / point_cnt * width;
        form.height.value = focus_object.object.y;
        drawCurve();
    }
});

//Функция отслеживания перемещения по экрану точки искривления
canvas.addEventListener('touchmove', function(e) {
    if(focus_object.status && focus_object.dragged){
        focus_object.object.x = Math.round(parseInt(e.changedTouches[0].clientX - canvas.offsetLeft) / width * point_cnt);
        focus_object.object.y = parseInt(e.changedTouches[0].clientY - canvas.offsetTop - height/2);
        let form = document.getElementById(getKeyByValue(curve_points, focus_object.object));
        form.width.value = focus_object.object.x / point_cnt * width;
        form.height.value = focus_object.object.y;
        drawCurve();
    }
});

//Функция отслеживания колесика мыши для изменения мощности
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    let Y = event.deltaY < 0 ? 1 : -1;
    if(focus_object.status && focus_object.length <= 8){
        let form = document.getElementById(getKeyByValue(curve_points, focus_object.object));
        form.power.value = parseFloat(form.power.value) + Y;
        focus_object.object.power = parseFloat(form.power.value);
    }
    drawCurve();
});

//Функция отслеживания отпускания мыши
document.addEventListener('mouseup', function(e) {
    focus_object.dragged=false;
});

//Функция отслеживания завершения касания
document.addEventListener('touchend', function(e) {
    focus_object.dragged=false;
});

//Инициализация
counter++;
curve_points[counter] = new Point(Math.round((width / 2) / width * point_cnt), 0, point_cnt/4, '#000', true);
create_form(curve_points[counter]);
drawCurve();