function Trial(){
  var trialTexture = THREE.ImageUtils.loadTexture("mats/trial.png");
  var trialMaterial = new THREE.SpriteMaterial( { map: trialTexture, useScreenCoordinates: true} );
	this.sprite = new THREE.Sprite( trialMaterial );
}
