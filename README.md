# Exocortex for Obsidian

A prototype plugin implementing the Exocortex concept.

Designed to enhance cognitive processes and decision-making within Obsidian.

## Expected data model

- Note - just a `.md` file
- Knowledge Object (KO) - Note with class (KOC)
- Knowledge Object Class (KOC) - Classification of a note

Every KO should have properties:

- uid
- tags (with class)

## Abbreviations

- fm - FrontMatter

## Terminology

- inbound link - unidirectional link to a note
- outbound link - unidirectional link from a note
- bidirectional link - both notes have links to each other

# Important

- Update of domain object will lead to removing all unknown properties from the object

# Known Issues

- Date fields (started, ended) behaves weird when starting and shutting down (with buttons in layout)
- When `StartEffort` is clicked, the `started` date is +1 hour than the current time
- Self link in Effort properties leads to endless freeze
- When selected text has `/` then [CreateEffortBySelectedText.ts](app/src/adapters/input/actions/no-context/domain/CreateEffortBySelectedText.ts) will throw an error

# TODO

- Implement `Effort.relates` field serde
- Add `Effort.trashed` field
- Create PersonArea domain class that extends Area
- Layout should show main properties (without historical)
- Every change of effort leads to freeze
	- short-term - editing in edit mode
	- long-term - optimize layout loading
		- parallel loading of sections
		- cancel loading after note change

# Code rules

## null & undefined

- undefined
	- as input parameter
	- as class field
- null - as return type
