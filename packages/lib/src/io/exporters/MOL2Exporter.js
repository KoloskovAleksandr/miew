import Exporter from './Exporter';
import Complex from '../../chem/Complex';

export default class MOL2Exporter extends Exporter {
  exportSync() {
    if (!this._source) {
      return this._result;
    }
    const result = [];

    this._extractMOLECULE(result);
    this._extractATOM(result);
    this._extractBOND(result);
    this._result = result.join('\n');
    return this._result;
  }

  _extractMOLECULE(result) {
    result.push('@<TRIPOS>MOLECULE');
    const source = this._source;
    const id = source.metadata.id.toString();
    result.push(id);
    const atoms = source._atoms.length.toString().padStart(6, ' ');
    const bonds = source._bonds.length.toString().padStart(6, ' ');
    const question = ' 0 0 0\n';
    result.push(atoms + bonds + question);
  }

  _extractATOM(result) {
    result.push('@<TRIPOS>ATOM');
    const atoms = this._source._atoms;
    const numOfAtoms = this._source._atoms.length;
    let atom;
    let residue;
    let serial = '';
    let role = '';
    let pos = '';
    let x = '';
    let y = '';
    let z = '';
    let name = '';
    let bond = '';
    let residueNum = '';
    let residueType = '';
    let charge = '';
    const dot = '.';
    for (let i = 0; i < numOfAtoms; i++) {
      atom = atoms[i];
      serial = atom.serial.toString().padStart(7, ' ');
      role = atom.name.padStart(5, ' ');
      pos = atom.position;
      x = pos.x.toFixed(4).padStart(9, ' ');
      y = pos.y.toFixed(4).padStart(9, ' ');
      z = pos.z.toFixed(4).padStart(9, ' ');
      name = atom.element.name.padStart(3, ' ');

      if (atom.bonds === undefined) {
        bond = '';
      } else {
        bond = atom.bonds.length.toString();
      }
      bond = bond.padEnd(6, ' ');

      residue = atom.residue;
      if (residue === undefined) {
        residueNum = '';
        residueType = '';
      } else {
        residueNum = residue._sequence.toString();
        residueType = residue._type.getName();
      }
      residueNum = residueNum.padEnd(4, ' ');

      charge = (atom.charge === undefined)
        ? '' : atom.charge.toFixed(4).padStart(12, ' ');
      result.push(serial + role + x + y + z + name + dot + bond + residueNum + residueType + residueNum + charge);
    }
  }

  _extractBOND(result) {
    result.push('@<TRIPOS>BOND');
    const bonds = this._source._bonds;
    const numOfBonds = this._source._bonds.length;
    let bond;
    let serial = '';
    let left = '';
    let right = '';
    let type = '';
    for (let i = 0; i < numOfBonds; i++) {
      bond = bonds[i];
      serial = `${i + 1}`.padStart(6, ' ');
      left = bond._left.serial.toString().padStart(6, ' ');
      right = bond._right.serial.toString().padStart(6, ' ');
      type = bond._type.toString().padStart(5, ' ');
      result.push(serial + left + right + type);
    }
  }
}

MOL2Exporter.formats = ['mol2'];
MOL2Exporter.SourceClass = Complex;
