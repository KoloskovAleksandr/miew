

import chem from '../../../chem';
import * as THREE from 'three';

var Assembly = chem.Assembly;

/**
 * Parser helper for PDB tag "REMARK 350".
 *
 * @exports Remark350
 * @constructor
 */
function Remark350(complex) {

  /** @type {Complex} */
  this._complex = complex;
  /** @type {Assembly[]} */
  this.assemblies = [];

  /** @type {?Assembly} */
  this._assembly = null;
  /** @type {?THREE.Matrix4} */
  this._matrix = null;
  /** @type {number} */
  this._matrixIndex = -1;
}

Remark350.prototype.id = 350;

/**
 * Parse a single line of a stream.
 * @param {PDBStream} stream - stream to parse
 */
Remark350.prototype.parse = function(stream) {
  /** @type {?Assembly} */
  var assembly = this._assembly;
  /** @type {?THREE.Matrix4} */
  var matrix = this._matrix;

  if (assembly && stream.readString(12, 18) === '  BIOMT') {
    var matrixRow = stream.readCharCode(19) - 49; // convert '1', '2', or '3' -> 0, 1, or 2
    var matrixData = stream.readString(20, 80).trim().split(/\s+/);
    var matrixIndex = matrixData[0];
    if (this._matrix === null || matrixIndex !== this._matrixIndex) {
      // TODO: assert(matrixIndex === assembly.matrices.length + 1);
      this._matrixIndex = matrixIndex;
      this._matrix = matrix = new THREE.Matrix4();
      assembly.addMatrix(matrix);
    }

    var elements = matrix.elements;
    elements[matrixRow]      = matrixData[1];
    elements[matrixRow + 4]  = matrixData[2];
    elements[matrixRow + 8]  = matrixData[3];
    elements[matrixRow + 12] = matrixData[4];
  } else if (assembly && stream.readString(35, 41) === 'CHAINS:') {
    var entries = stream.readString(42, 80).split(',');
    for (var i = 0, n = entries.length; i < n; ++i) {
      var chain = entries[i].trim();
      if (chain.length > 0) {
        assembly.addChain(chain);
      }
    }
  } else if (stream.readString(12, 23) === 'BIOMOLECULE:') {
    // var molIndex = stream.readInt(24, 80);
    // TODO: assert(molIndex === this.assemblies.length + 1);
    this._matrix = null;
    this._matrixIndex = -1;
    this._assembly = assembly = new Assembly(this._complex);
    this.assemblies.push(assembly);
  }
};

export default Remark350;

