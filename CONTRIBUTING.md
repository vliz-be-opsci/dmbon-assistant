<!--
  CONTRIBUTING.md
  Describes details on how to contribute
-->

**To do:**
- Do we want to include a code of conduct?


# Contributing
Thank you for taking your time to contribute! 
Open source projects are nothing without contributors, so all your contributions are greatly appreciated!
Below, we describe the guidelines to take into account when contributing to this project.

#### Table of contents
- [Our vision](#our-vision)
- [How can I contribute?](#how-can-i-contribute)
  - [Reporting bugs](#bug-reporting-bugs)
    - [Before submitting a bug report](#before-submitting-a-bug-report)
    - [How do I submit a useful bug report?](#how-do-i-submit-a-useful-bug-report)
  - [Suggesting new features](#bulb-suggesting-new-features)
    - [Before suggesting new features](#before-suggesting-new-features)
    - [How do I submit a (good) feature suggestion?](#how-do-i-submit-a-good-feature-suggestion)
  - [Your contribution](#your-contribution)
- [Pull requests](#wrench-pull-requests)
- [Who is involved?](#bustinsilhouette-who-is-involved)

---

## Our vision 
We are a small team and can only do so much.
Furthermore, we also cannot discover and fix all bugs and we can never cover all potential use cases and develop features for them. 
Additionally, we are huge advocates for open science and thus open source projects, such as this one. 
Therefore, we envision to establish a thriving community of users and developers alike.
We hope that this community can both improve and extend the functionality of DMBON-assistant and create a more open and widely used data pipeline.

| :exclamation: | Although we will explain the envisioned workflow with and by contributors below, please note that this workflow can also be changed. This means that any feedback on our envisioned workflow is also of great importance to us!
| :--- | :--- |


## Links to important resources
:link: [Issues](https://github.com/vliz-be-opsci/dmbon-assistant/issues) \
:link: [Discussions](https://github.com/vliz-be-opsci/dmbon-assistant/discussions) \
:link: Documentation

## Quickstart for developers
Explain, on the meta-level, the ''rules of the game''
* How do we intend to achieve specific things
* What do we **not** do (currently), e.g. 'we currently do not include testing', ...
  * @todo: Make a list of all things we know we should include, but are currently not included
  * @todo: Make the above list into open issues/feature suggestions?
  
The basic premise of open source, at least in our opinion, is that ideas should be motivated before being actively developed.
Therefore we intend that all contributors (that includes ourselves!) only spend considerable time into changes that actually matter. 
We _do_ wish to see an active community with those that are enthousiastic about Open Science, so even though you might not be a developer you can still contribute by giving feedback or filing issues. 
So whatever the problem is, **please do not hesitate to let us (and the community) know**!

Besides this, we do have some guidelines on the meta-level that we intend this project to follow.
* We would like the system to be as modular as possible. \
	This ensures that if a specific part breaks, the remainder can still continue. It also ensures that contributing to a specific part of the project is made much easier. Finally, it allows for relatively easy inclusion of new functionality as they only have to bridge or extend individual components instead of trying to fit in a monolithic framework with many (unexpected) dependencies.
* We would like the functionalit be targeted towards those with little to no programming experience. \
	Although we highly encourage experienced developers to add or change functionality that is suited for those with lots of programming experience, our main focus is the wider scientific community. Therein not everyone has the time to spend on learning a specific programming language for only a few tasks. We wish to streamline data management for everyone that handles (scientific) data, no exceptions. For this reason additional features should focus mainly on improving functionality without introducing technical overhead.

### What do we **not** do (currently)?
Below is an incomplete list of things we currently do not support.
You might use these as a stepping stone for contributing to this project, or completely ignore them - that is up to you! 
We are just happy that you have made it this far already! 
You can, of course, also point us to things we do **not** do and why we actually should be doing these.

* We do not include any testing (i.e. for verifying the installation).
* We do not include a command line interface for experienced users.
* We do not include ways to include the resulting RO-crates into a knowledge graph that can be queried efficiently.
* ...

---
## How can I contribute?

[//]: <> (BUG REPORTS)
#### :bug: Reporting bugs
Bugs are tracked as [GitHub issues](https://github.com/vliz-be-opsci/dmbon-assistant/issues). 
##### Before submitting a bug report
Before submitting a bug report, please check any (open or closed) issues that raised similar issues. 
If the bug is closely related and yet unsolved, consider adding to that discussion instead of filing a new issue. 
This might help us track down the bug and give priority to bugs that trouble multiple users.

##### How do I submit a useful bug report?
Once you have pinned down a bug, create an issue by providing sufficient information by filling in the provided template that should appear when filing a [new issue](https://github.com/vliz-be-opsci/dmbon-assistant/issues/new/choose).
Please ty to explain the problem clearly and concise and include additional details that might help us reproduce, pin down and fix the problem.
* Use a clear and descriptive title to identify the problem.
* Describe the exact steps you have taken that made you encounter the issue. 
* Describe the behavior that you expected.
* Include details about your configuration, OS, environment, versions, etc. 
* Describe what you have done to try to fix the issue.
* Include screenshots, logs, terminal output, or anything that could help illustrate the issue further.

[//]: <> (NEW FEATURE SUGGESTIONS)
#### :bulb: Suggesting new features 
When using DMBON-assistant you will undoubtedly have many great ideas about possible new features that you think should be included. 

##### Before suggesting new features
Before suggesting a new feature, please check the list of already suggested features. 
Additionally, check if there are already existing libraries that provide the enhancement - no need to reinvent the wheel!

##### How do I submit a (good) feature suggestion?
Once you have thought of a good feature suggestiong you can create an issue by providing the sufficient information through filling in the template that should appear when filing a [new issue](https://github.com/vliz-be-opsci/dmbon-assistant/issues/new/choose).
Please be sure to select the 'Feature request' template. 
Please try to explain the suggested feature clearly as others might be implementing this feature. 
Additionally, any suggestions on how you would like the feature to be integrated is more than welcome.
This can include (pseudo)code snippets, or 'MS Paint' style images that clearly lay out your idea.

---
[//]: <> (YOUR CONTRIBUTION)
### Your contribution
Are you unsure where to start contributing to DMBON-assistant? 
You might be able to contribute by starting browsing through issues or already open feature suggestions.
Below, we go through some ways you can contribute, but please keep in mind that we are open for any other suggestions that are not listed below!

[//]: <> (DOCUMENTATION)
#### :memo: Write documentation
We aspire to provide detailed documentation that describes how to use and modify DMBON-assistant.
If you encounter an opportunity to improve the documentation or fix errors in the documentation, we would be very happy if you did! 

#### :computer: Write example code
We intend to include descriptive example code that illustrates how we believe one should make use of DMBON-assistant.
However, there are only few of us and we can only think (and work out) so many examples. 
Therefore we would be thrilled if you decide to write and document examples, such that new users can get started more easily. 
Please have a look at the given examples for a general template of descriptive example code.


[//]: <> (PULL REQUESTS)
### :wrench: Pull requests
Did you fix a bug, implement a new feature, write documentation, work out a new example, or contributed to such a degree that the codebase should be updated?
If yes, please submit a pull request.

#### CLA assistant
We use [CLA assistant](https://cla-assistant.io/) to automate the process of contributors agreeing with our Contributor License Agreement (CLA). 


[//]: <> (WHO IS INVOLVED? LIST ALL CURRENT AUTHORS/CONTRIBUTORS)
### :bust_in_silhouette: Who is involved?
The main contributors are currently all members of the [VLIZ Open Science](https://www.vliz.be/en/open-science-vliz) team.

[The team](https://open-science.vliz.be/#team) (in no particular order):
* Marc Portier
* Cedric Decruw
* Laurian Van Maldeghem
* Katrina Exter
* Rory Meyer
* Johannes Nauta

For all contributions to the codebase, please refer to the [Github page on contributors](https://github.com/vliz-be-opsci/dmbon-assistant/graphs/contributors) for a detailed view on who did what exactly.
