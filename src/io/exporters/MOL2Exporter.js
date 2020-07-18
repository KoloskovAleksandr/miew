import Exporter from './Exporter';
import Complex from '../../chem/Complex';


const SMALL_IDENT = '   ';

export default class MOL2Exporter extends Exporter {
  exportSync() {
    if (!this._source) {
      return this._result;
    }
    const result = [];
    let curStr = '';

    curStr = '@<TRIPOS>MOLECULE';
    result.push(curStr);
    curStr = `${this._source.metadata.id}`;
    result.push(curStr);
    curStr = `${this._source._atoms.length} ${this._source._bonds.length}  0 0 0\n`;
    result.push(curStr);

    result.push('@<TRIPOS>ATOM');
    const atoms = this._source._atoms;
    const numOfAtoms = this._source._atoms.length;
    for (let i = 0; i < numOfAtoms; i++) {
      curStr = `${atoms[i].serial}${SMALL_IDENT}`;
      curStr += `N${SMALL_IDENT}`;
      curStr += atoms[i].position.x.toFixed(4) + SMALL_IDENT;
      curStr += atoms[i].position.y.toFixed(4) + SMALL_IDENT;
      curStr += atoms[i].position.z.toFixed(4) + SMALL_IDENT;
      curStr += `${atoms[i].element.name}.1${SMALL_IDENT}`;
      curStr += `${atoms[i].residue._sequence}${SMALL_IDENT}${atoms[i].residue._type.getName()}${atoms[i].residue._sequence}${SMALL_IDENT}`;
      curStr += atoms[i].charge.toFixed(4);
      result.push(curStr);
    }

    result.push('@<TRIPOS>BOND');
    const bonds = this._source._bonds;
    const numOfBonds = this._source._bonds.length;
    for (let i = 0; i < numOfBonds; i++) {
      curStr = `${i + 1}${SMALL_IDENT}`;
      curStr += `${bonds[i]._left.serial}${SMALL_IDENT}`;
      curStr += `${bonds[i]._right.serial}${SMALL_IDENT}`;
      curStr += `${bonds[i]._type}`;
      result.push(curStr);
    }
    this._result = result.join('\n');
    return this._result;
  }
}

MOL2Exporter.formats = ['mol2'];
MOL2Exporter.SourceClass = Complex;
