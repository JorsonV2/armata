function Trial(){
  var trialTexture = THREE.ImageUtils.loadTexture("mats/trial.png");
  var trialMaterial = new THREE.SpriteMaterial( { map: trialTexture, opacity: 0.6, useScreenCoordinates: true} );
	this.sprite = new THREE.Sprite( trialMaterial );
}
