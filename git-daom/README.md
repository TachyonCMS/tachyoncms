# Git DAO Manager - GitDAOM

Git DAOM is a git-based DAO Management app using Bitcoin Cash (BCH) with cashscript to create smart contracts.

It is geared towards supporting software development but could be used outside of that.

* ALL DAO info will be stored in a git repo. (tachyoncms/DAOM)

* A signed pull request approval process will be used to change any of that information.

* Git webhooks trigger event-based operations in the DAO contracts.

* A shared, internal ledger is kept of all BCH coming into the DAO and all BCH being spent.

* A multi-platform Quasar user interface (git-daom) will be used for editing the repo data and taking part in governance.

## Basic Flow from a Developer Perspective

1. The developer finds a task on open task on our Github and request it be assigned to them.
2. A DAO consensus is reached on assigning the task to the developer.
3. The developer agrees to the final terms.
4. The agreed upon fee is locked up in a smart contract.
5. The developer creates a pull request with finished work.
6. The pull request gets merged.
7. Git webhooks complete the payment to the developer.
8. If the webhook fails the developer can trigger the request to complete payment.
