…or create a new repository on the command line
echo "# POS" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
# git remote add origin https://github.com/haguero72072107602/POS.git
git remote add origin https://github.com/haguero72072107602/Restaurant.POS.New.git
git push -u origin main


https://github.com/haguero72072107602/Restaurant.POS.New

…or push an existing repository from the command line
#git remote add origin https://github.com/haguero72072107602/POS.git
git remote add origin https://github.com/haguero72072107602/Restaurant.POS.New.git
git branch -M main
git push -u origin main


*************** GitLab **************************

url = https://gitlab.com/swicpos/restaurant-pos-new.git

cd existing_repo
git remote add origin https://gitlab.com/swicpos/restaurant-pos-new.git

git branch -M main
git push -uf origin main

********************* Tailwind *******************

npm run build

force update remote
****** Forzar actualizacion **********************
git pull -f --set-upstream origin main
git push --force --set-upstream origin main
git push -uf origin main