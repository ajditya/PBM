-- Add a per-model measurements unit (cm / inches). Existing rows default to cm.
alter table models
  add column if not exists measurements_unit text not null default 'cm';
