-- ConstructibleText
-- Author: JNR
--------------------------------------------------------------

-- English
--------------------------------------------------------------
UPDATE LocalizedText SET Text = REPLACE(Text, 'Great Library', 'Great Bibliotheque');

INSERT OR REPLACE INTO EnglishText
		(Tag,															Text)
VALUES	('LOC_WONDER_GREAT_LIBRARY_NAME',								'Great Library'),
		('LOC_WONDER_GREAT_LIBRARY_DESCRIPTION',						'+2 [icon:YIELD_DIPLOMACY] Influence. +1 [icon:YIELD_SCIENCE] Science on displayed Great Works in this city. Has 2 Codex slots. Ageless. Must be placed on Flat Terrain adjacent to a District.'),
		('LOC_WONDER_GREAT_LIBRARY_TOOLTIP',							'+1 [icon:YIELD_SCIENCE] Science on displayed Great Works in this city. Has 2 Codex slots. Ageless. Must be placed on Flat Terrain adjacent to a District.'),
		('LOC_QUOTE_WONDER_GREAT_LIBRARY',								'We can roam the bloated stacks of the Library of Alexandria, where all imagination and knowledge are assembled. We can recognize in its destruction the warning that all we gather will be lost, but also that much of it can be collected again.'),
		('LOC_QUOTE_AUTHOR_WONDER_GREAT_LIBRARY',						'Alberto Manguel'),
		('LOC_PEDIA_PAGE_WONDER_GREAT_LIBRARY_CHAPTER_HISTORY_PARA_1',	'The Great Library of Alexandria was one of the two most important libraries of the ancient world. Ptolemy I founded it around 300 BCE, and the Library was enhanced and expanded by his successors. The Library attempted to obtain copies of all scrolls of any consequence, and eventually contained over 700 000 volumes. Religious fanatics destroyed the library in 391 CE, after nearly 700 years of operation. Today, only a portion of the catalog survives, providing us with a mere hint of what treasures the library contained.');

UPDATE LocalizedText SET Text = REPLACE(Text, 'and the Nalanda Wonder', 'the Great Library Wonder, and the Nalanda Wonder') WHERE Tag='LOC_PEDIA_CONCEPTS_PAGE_CODEX_1_CHAPTER_CONTENT_PARA_2';
--------------------------------------------------------------