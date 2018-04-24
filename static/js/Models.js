function Model() {

    var container = new THREE.Object3D
    var mixer

    this.loadModel = function (url, callback) {

        var loader = new THREE.JSONLoader();

        loader.load(url, function (geometry) {

	    // ładowanie modelu jak porzednio

	    //utworzenie mixera

            //dodanie modelu do kontenera

            container.add(meshModel)

            // zwrócenie kontenera

            callback(container);

        });
    }
