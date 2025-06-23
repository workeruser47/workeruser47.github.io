(function() {  
    'use strict';  
  
    Lampa.Plugin.add({  
        plugin: 'endtime',  
        name: 'Время окончания фильма',  
        description: 'Показывает время окончания текущего фильма рядом с часами',  
        author: 'lampac',  
        version: '1.0.0'  
    });  
  
    let endTimeElement = null;  
    let updateInterval = null;  
  
    function formatTime(date) {  
        return date.toLocaleTimeString('ru-RU', {  
            hour: '2-digit',  
            minute: '2-digit'  
        });  
    }  
  
    function updateEndTime() {  
        const video = document.querySelector('video');  
        if (!video || !video.duration || isNaN(video.duration)) {  
            if (endTimeElement) {  
                endTimeElement.style.display = 'none';  
            }  
            return;  
        }  
  
        const remainingTime = video.duration - video.currentTime;  
        const endTime = new Date(Date.now() + remainingTime * 1000);  
          
        if (!endTimeElement) {  
            createEndTimeElement();  
        }  
          
        endTimeElement.textContent = `Конец: ${formatTime(endTime)}`;  
        endTimeElement.style.display = 'block';  
    }  
  
    function createEndTimeElement() {  
        endTimeElement = document.createElement('div');  
        endTimeElement.style.cssText = `  
            position: fixed;  
            top: 60px;  
            right: 20px;  
            color: white;  
            font-size: 14px;  
            font-family: Arial, sans-serif;  
            background: rgba(0, 0, 0, 0.7);  
            padding: 5px 10px;  
            border-radius: 4px;  
            z-index: 9999;  
            display: none;  
        `;  
        document.body.appendChild(endTimeElement);  
    }  
  
    function startTracking() {  
        if (updateInterval) {  
            clearInterval(updateInterval);  
        }  
          
        updateInterval = setInterval(updateEndTime, 1000);  
        updateEndTime();  
    }  
  
    function stopTracking() {  
        if (updateInterval) {  
            clearInterval(updateInterval);  
            updateInterval = null;  
        }  
          
        if (endTimeElement) {  
            endTimeElement.style.display = 'none';  
        }  
    }  
  
    // Инициализация плагина  
    Lampa.Listener.follow('app', function(e) {  
        if (e.type === 'ready') {  
            const observer = new MutationObserver(function(mutations) {  
                mutations.forEach(function(mutation) {  
                    if (mutation.type === 'childList') {  
                        const video = document.querySelector('video');  
                        if (video) {  
                            video.addEventListener('loadedmetadata', startTracking);  
                            video.addEventListener('play', startTracking);  
                            video.addEventListener('pause', stopTracking);  
                            video.addEventListener('ended', stopTracking);  
                        }  
                    }  
                });  
            });  
  
            observer.observe(document.body, {  
                childList: true,  
                subtree: true  
            });  
        }  
    });  
  
})();
