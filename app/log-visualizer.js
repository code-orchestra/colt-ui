(function() {
    var stopped = true;

    var context, messages = [], msPerColumn = 1000;

    function resizeCanvas () {
        var canvas = context.canvas;
        canvas.width = window.innerWidth;
        canvas.height = 130;
        draw();
    }

    function init() {
        context = document.getElementById("canvas").getContext("2d");

        resizeCanvas();
        setInterval(draw, 345);
        alert("command:ready");
        setInterval(function(){
            alert("command:flush")
        }, 100)

    }

    if (!Date.now) {
        Date.now = function () {
            return (new Date()).getTime();
        };
    }

    function addLogMessages (levels) {
        // unless we quantize time, animation will have beats
        var t = ((Date.now() / msPerColumn) | 0) * msPerColumn;
        var m = { counts: [0, 0, 0, 0], time: t };
        for (var i = 0, n = levels.size(); i < n; i++) {
            switch (levels.get(i).name()) {
                case "FATAL":
                case "ERROR":
                m.counts[0]++; break;
                case "WARN":
                m.counts[1]++; break;
                case "INFO":
                m.counts[2]++; break;
                case "LIVE":
                m.counts[3]++; break;
            }
        }
        messages.unshift(m);

        // CJ-853
        // мессаги приходят не чаще чем каждые 0.1с
        // на большом экране может поместиться график на <5 минут
        // итого, имеем 5 * 60 / 0.1 = 3000 необходимых данных
        // всё, что больше, не нужно
        if (messages.length > 5000) messages.pop();

//        alert ("Received " + m.counts[0] + " errors, " + m.counts[1] + " warnings, " + m.counts[2] + " infos");
}

function draw () {
    var W, H, now = Date.now();

        // clear
        context.clearRect(0, 0, W = context.canvas.width, H = context.canvas.height);

        context.fillStyle = '#f7f8fa';
        context.fillRect(0, 0, W, H);

        // grid
        var fillStyles = [], rows = 3; //4;
        var grey = '#dee0e4', colors = ['#ba2b19', '#f6c930', '#2d67d0', '#009900'];

        for (var c = 0, w = 35; w < W - 30; c++, w += 13) {

            // find column time range
            var tFrom = now - msPerColumn * (c + 1), tTo = now - msPerColumn * (c);

            // find message counts in that range
            var counts = [0, 0, 0, 0];
            for (var i = 0, n = messages.length; i < n; i++) {
                if ((messages[i].time < tTo) && (messages[i].time >= tFrom)) {
                    for (var j = 0; j < rows; j++) {
                        counts[j] += messages[i].counts[j];
                    }
                }
            }

            // select colors
            for (var j = 0; j < rows; j++) {
                fillStyles[j] = grey;
                if (stopped) continue;
                // todo: threshold
                if (counts[j] > 0) {
                    fillStyles[j] = colors[j];
                }
            }

            // finally draw the column
            for (var j = 0, h = 47; j < rows; j++, h += 13) {
                context.fillStyle = fillStyles[j];
                context.fillRect(w, h, 12, 12);
            }
        }

        // ticks and numbers
        context.fillStyle = '#8e9094';
        context.font = "11px sans-serif";
        if (!stopped) {
            context.strokeStyle = '#caccd0';
            context.lineWidth = 1;
            context.beginPath();
            var d = ((now / msPerColumn)|0) % 4
            for (var w = 86.5 + 13 * (d - 4), j = d; w < W - 30; w += 52, j += 4) {
                if ((j == d) && (d == 0)) continue;

                context.moveTo(w, 41);
                context.lineTo(w, 46);

                var text = "" + (((now - j * msPerColumn) / 1000) | 0) % 60;
                context.fillText(text, w - text.length * 3, 38);
            }
            context.stroke();
        }

        // legend text todo: actual text
        var legendText = "sec";
        context.fillText(legendText, 17 - legendText.length * 3, 38);
    }

    window.onerror = function myErrorFunction(message, url, linenumber) {
        alert("------------------------------------")
        alert("js error (message): " + message)
        alert("js error (url): " + url)
        alert("js error (line number): " + linenumber)
        alert("------------------------------------")
    }

    function clearMessages() {
        messages.length = 0;
    }

    function start() {
        stopped = false;
        clearMessages();
    }

    function stop() {
        stopped = true;
        clearMessages();
    }

    function pause() {
        stopped = true;
    }
})()