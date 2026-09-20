import React from 'react';
import { DatabaseIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { StepProps } from '../types';
import type { DatabaseDesign, DbColumn, DbTable } from '../../../types/project';
import { Panel } from '../../ui/Panel';
import { Button } from '../../ui/Button';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { ListEditor } from '../../ui/ListEditor';
import { EmptyState } from '../../ui/EmptyState';
import { AIAssist } from '../AIAssist';
import { COLUMN_TYPES, DB_TYPES, KEY_TYPES } from '../../../data/catalogs';
import { uid } from '../../../utils/cn';

export function DatabaseStep({ project, update }: StepProps) {
  const db = project.database;
  const setDb = (values: Partial<DatabaseDesign>) => update((p) => ({ ...p, database: { ...p.database, ...values } }));
  const setTables = (tables: DbTable[]) => setDb({ tables });

  const addTable = () =>
  setTables([
  ...db.tables,
  {
    id: uid('tbl'),
    name: '',
    description: '',
    columns: [{ id: uid('col'), name: 'id', type: 'INT', key: 'PK', constraints: 'NOT NULL', description: 'Unique identifier' }]
  }]
  );

  const patchTable = (id: string, values: Partial<DbTable>) =>
  setTables(db.tables.map((t) => t.id === id ? { ...t, ...values } : t));

  const patchColumn = (tableId: string, columnId: string, values: Partial<DbColumn>) =>
  setTables(
    db.tables.map((t) =>
    t.id === tableId ? { ...t, columns: t.columns.map((c) => c.id === columnId ? { ...c, ...values } : c) } : t
    )
  );

  const isDocumentStore = db.type === 'MongoDB' || db.type === 'Firebase Firestore';

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Database design</h2>
        <p className="text-[13.5px] text-ink2 mt-1">
          Every {isDocumentStore ? 'collection' : 'table'} becomes a numbered table in Chapter 7 of the report.
        </p>
      </header>

      <Panel title="Database">
        <div className="grid sm:grid-cols-[220px_1fr] gap-4 items-start">
          <Field label="Database type" htmlFor="db-type">
            <Select id="db-type" options={DB_TYPES} value={db.type} onChange={(e) => setDb({ type: e.target.value })} />
          </Field>
          <Field label="Database overview" htmlFor="db-overview">
            <Textarea
              id="db-overview"
              rows={3}
              value={db.overview}
              placeholder="How data is organised and why this database was chosen."
              onChange={(e) => setDb({ overview: e.target.value })} />
            
          </Field>
        </div>
        <div className="mt-2.5">
          <AIAssist
            task="databaseOverview"
            project={project}
            current={db.overview}
            label="Generate overview"
            onAccept={(text) => setDb({ overview: text })} />
          
        </div>
      </Panel>

      <Panel
        title={isDocumentStore ? 'Collections' : 'Tables'}
        description="Fields, data types, keys and constraints are written into the report exactly as entered."
        actions={
        <Button size="sm" variant="primary" icon={<PlusIcon className="w-3.5 h-3.5" />} onClick={addTable}>
            Add {isDocumentStore ? 'collection' : 'table'}
          </Button>
        }>
        
        {db.tables.length === 0 ?
        <EmptyState
          icon={<DatabaseIcon className="w-5 h-5" />}
          title="No tables defined"
          description="Add the tables or collections your system stores data in, along with their fields."
          action={<Button variant="primary" onClick={addTable}>Add the first table</Button>} /> :


        <ul className="flex flex-col gap-4">
            {db.tables.map((t, ti) =>
          <li key={t.id} className="rounded-lg border border-line p-3.5">
                <div className="grid sm:grid-cols-[minmax(0,240px)_1fr_auto] gap-3 items-end">
                  <Field label={`${isDocumentStore ? 'Collection' : 'Table'} name`} htmlFor={`tn-${t.id}`}>
                    <Input id={`tn-${t.id}`} value={t.name} placeholder="users" onChange={(e) => patchTable(t.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Description" htmlFor={`td-${t.id}`}>
                    <Input id={`td-${t.id}`} value={t.description} placeholder="Stores every account with its role" onChange={(e) => patchTable(t.id, { description: e.target.value })} />
                  </Field>
                  <Button
                variant="ghost"
                aria-label={`Delete table ${t.name || ti + 1}`}
                icon={<Trash2Icon className="w-3.5 h-3.5" />}
                onClick={() => setTables(db.tables.filter((x) => x.id !== t.id))} />
              
                </div>

                <div className="mt-3 overflow-x-auto scroll-thin">
                  <table className="w-full text-[12.5px] min-w-[720px]">
                    <thead>
                      <tr className="text-left text-ink3 border-b border-line2">
                        <th className="py-1.5 pr-2 font-medium">Field</th>
                        <th className="py-1.5 pr-2 font-medium">Type</th>
                        <th className="py-1.5 pr-2 font-medium">Key</th>
                        <th className="py-1.5 pr-2 font-medium">Constraints</th>
                        <th className="py-1.5 pr-2 font-medium">Description</th>
                        <th className="py-1.5 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {t.columns.map((c) =>
                  <tr key={c.id}>
                          <td className="py-1 pr-2">
                            <Input className="h-8" value={c.name} aria-label="Field name" onChange={(e) => patchColumn(t.id, c.id, { name: e.target.value })} />
                          </td>
                          <td className="py-1 pr-2 w-[120px]">
                            <Select className="h-8" options={COLUMN_TYPES} value={c.type} aria-label="Field type" onChange={(e) => patchColumn(t.id, c.id, { type: e.target.value })} />
                          </td>
                          <td className="py-1 pr-2 w-[92px]">
                            <Select className="h-8" options={KEY_TYPES} value={c.key} aria-label="Key" onChange={(e) => patchColumn(t.id, c.id, { key: e.target.value })} />
                          </td>
                          <td className="py-1 pr-2 w-[150px]">
                            <Input className="h-8" value={c.constraints} aria-label="Constraints" onChange={(e) => patchColumn(t.id, c.id, { constraints: e.target.value })} />
                          </td>
                          <td className="py-1 pr-2">
                            <Input className="h-8" value={c.description} aria-label="Field description" onChange={(e) => patchColumn(t.id, c.id, { description: e.target.value })} />
                          </td>
                          <td className="py-1">
                            <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`Delete field ${c.name}`}
                        icon={<Trash2Icon className="w-3.5 h-3.5" />}
                        onClick={() => patchTable(t.id, { columns: t.columns.filter((x) => x.id !== c.id) })} />
                      
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>

                <Button
              size="sm"
              className="mt-2"
              icon={<PlusIcon className="w-3.5 h-3.5" />}
              onClick={() =>
              patchTable(t.id, {
                columns: [...t.columns, { id: uid('col'), name: '', type: 'VARCHAR', key: '-', constraints: '', description: '' }]
              })
              }>
              
                  Add field
                </Button>
              </li>
          )}
          </ul>
        }
      </Panel>

      <div className="grid lg:grid-cols-2 gap-5">
        <Panel title="Relationships" description="Section 7.3 of the report.">
          <ListEditor
            items={db.relationships}
            onChange={(relationships) => setDb({ relationships })}
            placeholder="One user can create many exams"
            emptyLabel="No relationships described yet." />
          
        </Panel>
        <Panel title="Constraints" description="Section 7.4 of the report.">
          <ListEditor
            items={db.constraints}
            onChange={(constraints) => setDb({ constraints })}
            placeholder="Email addresses are unique"
            emptyLabel="No constraints described yet." />
          
        </Panel>
      </div>
    </div>);

}