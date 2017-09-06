

import * as THREE from 'three';
import utils from '../../utils';
import gfxutils from '../gfxutils';
import ChunkedObjectsGeometry from './ChunkedObjectsGeometry';

var VEC_SIZE = 3;
var tmpVector = new THREE.Vector3();
var normMtx = new THREE.Matrix3();

function CylinderCollisionGeo(instanceCount, polyComplexity) {
  var cylGeometry = new THREE.CylinderBufferGeometry(1, 1, 1.0, Math.max(3, polyComplexity), 2, true);
  ChunkedObjectsGeometry.call(this, cylGeometry, instanceCount);

  var chunkSize = this._chunkSize;
  this._chunkPos = this._chunkGeo.attributes.position.array;
  this._chunkNorms = this._chunkGeo.attributes.normal.array;
  this._tmpVector = utils.allocateTyped(Float32Array, chunkSize * VEC_SIZE);
}

CylinderCollisionGeo.prototype = Object.create(ChunkedObjectsGeometry.prototype);
CylinderCollisionGeo.prototype.constructor = CylinderCollisionGeo;

CylinderCollisionGeo.prototype.setItem = function(itemIdx, botPos, topPos, itemRad) {
  var chunkSize = this._chunkSize;
  var itemOffset = chunkSize * itemIdx * VEC_SIZE;

  var tmpArray = this._tmpVector;
  var geoPos = this._chunkPos;
  var geoNorm = this._chunkNorms;

  var mtx1 = gfxutils.calcCylinderMatrix(botPos, topPos, itemRad);
  normMtx.getNormalMatrix(mtx1);
  var i = 0;
  var idx;
  for (; i < chunkSize; ++i) {
    idx = i * VEC_SIZE;
    tmpVector.fromArray(geoPos, idx);
    tmpVector.applyMatrix4(mtx1);
    tmpVector.toArray(tmpArray, idx);
  }
  this._positions.set(tmpArray, itemOffset);

  for (i = 0; i < chunkSize; ++i) {
    idx = i * VEC_SIZE;
    tmpVector.fromArray(geoNorm, idx);
    tmpVector.applyMatrix3(normMtx);
    tmpVector.toArray(tmpArray, idx);
  }
  this._normals.set(tmpArray, itemOffset);
};

export default CylinderCollisionGeo;

