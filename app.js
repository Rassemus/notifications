
window.addEventListener('online', () => {
    const dataFromLocalStorage = getSubscriptionsFromLocalStorage();
    for(const i in dataFromLocalStorage){
        const key = Object.keys(dataFromLocalStorage[i])[0];
        if(key === "subscribe"){
        subscribe(dataFromLocalStorage[i][key])
        }else if(key === "unsubscribe"){
        unsubscribe(dataFromLocalStorage[i][key])
        }else{
            console.error("Something went wrong!")
        }
    }
    localStorage.clear();
    setTimeout(function() {
        location.reload();
    }, 1000);
  });
  