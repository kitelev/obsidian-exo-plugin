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

# TODO

- Create PersonArea domain class that extends Area

# Code rules

## null & undefined

- undefined
	- as input parameter
	- as class field
- null - as return type
