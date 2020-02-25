# MyFinancePal
Team Project

Github commands: 

Before starting any new work (make sure you have pushed your previous changes before this): 

    'git pull' (to check if any changes have been made to master i.e. the code on github)

To push code to Github, enter the following commands (move to the next step only if the previous one was successful):

    git status (this shows you which files you have changed, good to check in case you accidentally changed something - 
    these are listed in red because they are unstaged i.e. not in the list of files to be committed)

    git add . (adds all of your changed files to the files which will be committed i.e. stages them, you can also enter 
    just specific file names here if you want but we'll probably only want to commit all files each time)

    git status (files should now be listed in green because they are staged)

    git commit -m 'some message about your changes'

    git push

Let everyone else know you've pushed something!

**   If your push is rejected it is most likely because someone else pushed something
    after you last pulled down the code. If so (after going through the above steps),
    enter these commands:
        
        git pull 

        git push 
**

**
    If you have merge conflicts, click on the source control button (looks like a tree) 
    and open the files with the conflicts. Make sure your commit went through. Click compare changes.
    After that, review the code to see which option to choose. You will have to choose
    which changes to accept and / or reject. If you're not sure, ask someone else. If
    you're sure you've fixed the conflict, enter the following commands:

        git status 

        git add . (since you accepted or rejected changes, the files 
        are different and you need to stage them again)

        git status 

        git commit -m 'some message about your changes'

        git push

**