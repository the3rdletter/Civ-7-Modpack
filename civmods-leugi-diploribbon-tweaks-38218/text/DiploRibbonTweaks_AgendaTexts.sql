UPDATE LocalizedText
SET Text = '[icon:LEU_BULLET_POSITIVE]'||Text
WHERE Tag LIKE '%AGENDA%DESC';

UPDATE LocalizedText
SET Text = replace(Text, ". ", ".[N][icon:LEU_BULLET_NEGATIVE]")
WHERE Tag LIKE '%AGENDA%DESC';