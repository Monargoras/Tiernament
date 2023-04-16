# Tiernament

Tournament style tier lists. Built with MongoDB, Kotlin and React.

## About

Tiernament is a web application that allows users to create and participate in 
tier list tournaments. Users can create a Tiernament with a title, description, 
and a list of items. Users can then play through other users Tiernaments and 
find their personal winner in the given category. 

![HomePage](/assets/TiernamentMain.png)

Each Match Up is a 1v1 between two items. 
The user can vote for the entry they prefer 
until the playoffs begin.
The structure follows the swiss system until 8 entries remain.
Each swiss stage, half the entries are eliminated 
and the remaining entries move on.
A maximum of 32 entries can be added to a Tiernament,
leading to a maximum of 2 Swiss stages.
Each stage is divided into 5 rounds, meaning entries with 3 wins move on
and entries with 3 losses are eliminated in the end.

![MatchUp](/assets/TiernamentMatchUp.png)

The final 8 compete in a seeded playoff bracket and the final winner is determined.

![Winner](/assets/TiernamentWinner.png)

The editor allows users to create and edit their own Tiernaments.
This includes adding and removing items, changing the title, 
description and cover image.
For each item, the user can add a name and image.
Importing a batch of items using multiple images is also supported.

![Editor](/assets/TiernamentEditor.png)