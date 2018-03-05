
(function () {
    function audioAutoPlay(id) {
        var audio = document.getElementById(id);
        if (!audio) {
            return false;
        }
        var play = function () {
            audio.play();
            document.removeEventListener("touchstart", play, false);
        };
        play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            play();
        }, false);
        document.addEventListener('YixinJSBridgeReady', function () {
            play();
        }, false);
        document.addEventListener("touchstart", play, false);
    }

    audioAutoPlay('mp3');
})();
