
# PDFL - PDF Legacy

A smart PDF reader.






## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) 

![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/matteovisotto/PDFL-PDFLegacy)

![languages](https://img.shields.io/github/languages/count/matteovisotto/PDFL-PDFLegacy)

![size](https://img.shields.io/github/repo-size/matteovisotto/PDFL-PDFLegacy)

![javascript](https://img.shields.io/github/languages/top/matteovisotto/PDFL-PDFLegacy)

![contributors](https://img.shields.io/github/contributors/matteovisotto/PDFL-PDFLegacy)

![rating](https://img.shields.io/github/stars/matteovisotto/PDFL-PDFLegacy?style=social)

## Description
In the research environment reading papers (PDF documents) is an everyday task. When a researcher
or a student is reading a paper it can be difficult to handle all the information such as external citations,
references, tables, images, and so on, at once.
In most cases, there is so much information that user spends a significant amount of time on retrieving it
and this takes away precious time that could be used to focus on research. PDFL intends to offer a basic PDF reader and the automatization of most of the actions performed by a researcher to retrieve information about a specific paper or PDF document. PDFL can also be used as a browser extension which is easily reached with a single mouse click once installed. By providing four new features, researchers can organize and access all external citations with a generated conceptual map, visualize immediately an inner cross-reference, generate a summary of the whole document or only a small portion of selected text and highlight topic-specific phrasing.

Main Features are: 

     	

    • resolving and presenting cross-references inside a paper. 

    • building a knowledge graph for the references of a paper.

    • generating/mining summarizations for key components of the paper.

    • highlighting used, topic-specific phrasings

    • (one more thing) chrome extension to upload directly pdf open in online editor on pdfl-pdf-legacy.onrender.com 
## Authors

PDF Legacy is team for Distributed Software Development (DSD) course. DSD is a joint course of:

    Mälardalen University (MdU), IDT Embedded Systems, Sweden
    University of Zagreb, Faculty of Electrical Engineering and Computing (FER), Croatia
    Politecnico di Milano, (POLIMI), Information Engineering School , Italiy

Our team consists of following members:

    Paolo Corsa Product Owner (POLIMI)
    Tonio Ercegović Scrum Master (FER) 
    Nina Gnjidić Developer (FER)  
    Dario Mesic Developer (FER) 
    Salvatore Gabriele Karra Developer (POLIMI)
    Matteo Visotto Developer (POLIMI) 
    Ettore Zamponi Developer (POLIMI)

Our team is supervised by:

    Raffaela Mirandola (POLIMI)
    Ivana Bosnić (FER)

## Tech Stack

    • HTML, CSS
    • JavaScript, Webpack
    • Jest, Cypress


## Architecture overview

![Logo](https://github.com/matteovisotto/PDFL-PDFLegacy/blob/main/dist/assets/ComponentArchitecture.png)


## Demo

https://pdfl-pdf-legacy.onrender.com/#

## Chrome Extension

Available on Google Chrome : https://chrome.google.com/webstore/detail/pdf-legacy/cnfmfaohminlbglpkfhbofiolmndonkj

Youtube Video : https://www.youtube.com/watch?v=iQiwKOZlEcs&list=LL&index=1&t=7s
## Installation

### Setup and start locally

```shell
cp .env.example .env
npm install
npm run serve
```

### Run tests

#### Unit tests

```shell
npm install
npm test
```

#### E2E Cypress runner

```shell
npm install
npm run cypress:open
```

### Build to the dist directory

```shell
npm run build
```
![Logo](https://github.com/matteovisotto/PDFL-PDFLegacy/blob/main/dist/assets/green_logo.png)

