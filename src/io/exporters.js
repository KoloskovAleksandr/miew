import ExporterList from './exporters/ExporterList';

import PDBExporter from './exporters/PDBExporter';
import FBXExporter from './exporters/FBXExporter';
import MOL2Exporter from './exporters/MOL2Exporter';

export default new ExporterList([
  PDBExporter,
  FBXExporter,
  MOL2Exporter,
]);
