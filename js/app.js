function Algorithm(type, strategy) {
    this.type = type;
    this.strategy = strategy;
    this.dataSetSize = document.getElementById("dataset_size").value || 10;
    this.title = this.strategy + " " + this.type;

    this.changeSpeed = () => {
        return parseInt(document.getElementById('speed').dataset.seconds);
    }

    this.timeDelay = async (speed) => {
        return new Promise(resolve =>
            setTimeout(() => {
              resolve();
            }, speed)
          );
    }
}