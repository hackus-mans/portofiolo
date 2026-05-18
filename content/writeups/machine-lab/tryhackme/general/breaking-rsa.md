---
section: machine-lab
platform: Tryhackme
category: Général
status: Publié
difficulty: À définir
tags:
---

Le challenge ==Breacking RSA== est un challenge qui consiste a cassé le RSA mal implémenté en utilisant l’algorithme de factorisation de Fermat.


Donc pour réuissir le challenge il faudra repondre étape par étape a un certain nombres de question que le challenge même propose

  

  

### ==Première question : How many services are running on the box ?==

cette question nous demande de donnée le nombres de services qui tourne sur la machine cible qu’ils nous ont données.

  

pour repondre a cette question , nous devons tous suite pensé a utilisé nmap ou autre outil cable de faire un scan de port sur la machine cible

  

Donc lançons la commande sur notre machine attaquante (ça peut être la machine attaquante fourni par le site ou votre propre machine via une connexion VPN). Nous utiliserons dans ce cas Nmap. Chacun est libre de choisi l’outil qui le va le mieux (tant que cet outil permet de faire un scan de port)

![image.png](/portofiolo/content/writeups/media/image-3.png)

  

![image 1.png](/portofiolo/content/writeups/media/image-1-2.png)

  

```LaTeX
Un peu de commentaire

la première capture montre que nous avont utilisé la commande nmap 10.65.162.240 et le résultat 
nous montre que nous avont un certain nombre de port ouvert . mais le seul 
problème c'est qu'elle n'a fait qu'un scan des 1000 ports les plus courants.

Donc c'est là que nous utilions la deuxième commande en y ajoutant l'option -p (cette option permet de scanné tous les ports c'est a dire
les 65535 ports qui existe)

on pouvais egalement ajouté l'option -sV pour voir la version des services qui tourne
```

![image 2.png](/portofiolo/content/writeups/media/image-2-2.png)

  

Donc avec le résultat des deux premiers scans vous pouvez tous suite en déduire le nombre de service qui tourne sur la machine cible.

  

==Maintenant passons a la phase 2==

  

  

## ==Deuxième question : What is the name of the hidden directory on the web server? (without leading '/')==

Si on se souvient bien lors de notre scan dans la première etape nous nous somme rendu compte qu’il y’avais un service http qui y étais , donc ce qui veut dire qu’il y’a un site web.Essayons d’y jeté un coup d’oeil pour voir

![image 3.png](/portofiolo/content/writeups/media/image-3-2.png)

Maintenant cette question qui nous a été actuellement posé nous fais savoir qu’en réalité sur ce site il y’a un repertoire caché, et nous devrons le découvrir. Il est possible qu’il y’ai plusieurs repertoires caché mais un autre indice qu’ils nous ont donnée c’est que le repertoire caché commence par un slash (`/`)

  

Trouvé, nous devons utilisé un outil qui va permettre la recherche de cet repertoire caché, nous pouvons utiliser :

- ffuf

- gobuster

- dirb

- et bien d’autre

  

nous nous allons utilisé l’outil gobuster pour faire le truc

donc la commande est : `gosbuster [mode] -u “le_lien_du_site” -w “la_word_list”`

![Capture_dcran_2026-01-23_103105](/portofiolo/content/writeups/media/capture_dcran_2026-01-23_103105.png)

  

- ici la bonne réponse est le deuxieme repertoire car il es compatible avec le format donnée

- pour trouvé des réponses conséquente il faudra utilisé les bon dictionnaires

==bon maintenant essayons d’accédé a ce repertoir caché==

![Capture_dcran_2026-01-23_115958](/portofiolo/content/writeups/media/capture_dcran_2026-01-23_115958.png)

  

Ah on voit un fichier un peu comme une clé publique (==id_rsa.pub====). Essayons de la téléchargé et voir ce qu’il y’a a l’interieur==

![image 4.png](/portofiolo/content/writeups/media/image-4.png)

nous pouvons affirmé sans doute qu’il s’agit bien d’une clé public de type ssh-rsa

  

  

## ==Troisième question : What is the length of the discovered RSA key? (in bits)==

  

Bon etant donnée qu’il s’agit d’une clé public pour le protocole ssh , il a été généré alors avec la commande ssh-keygen. donc cet même outil nous permet de voir la taille de la clé (quel soit public ou privé ) juste en ajoutans quelque options

l’option a ajouté est -lf (-l et -f) et donc la commande devient `ssh-keygen -lf <le_nom_de_la_clé>`

![Capture_dcran_2026-01-23_144843](/portofiolo/content/writeups/media/capture_dcran_2026-01-23_144843.png)

- En rouge nous avont la taille de la clé en bit

  

NB: pour mieux comprendre comment es ce que la génération de clé pour ssh fonction vous pouvez consulté

[Configuration et sécurisation de SSH](https://www.notion.so/Configuration-et-s-curisation-de-SSH-2c4b1b6772dd8110b278d70535daefef?pvs=21)

  

  

  

## ==Quatrième question: What are the last 10 digits of n? (where 'n' is the modulus for the public-private key pair)==

Pour ce faire vous devrai utiliser le package PyCryptodone comme ils l’avaient mention depuis le début.

le petit code a utilsé est le suivant :

```Python
from Crypto.PublicKey import RSA
f = open("id_rsa.pub", "r")
key = RSA.importKey(f.read())
print (key.n) \#displays n
print (key.e) \#displays e
```

  

et donc vous obtiendrais le résultat (la valeur de n)

![Capture_dcran_2026-01-23_153528](/portofiolo/content/writeups/media/capture_dcran_2026-01-23_153528.png)

  

## ==Cinquième question : factorisé n en p et q==

Pour la factorisation de n en p et q vous pouvez utiliser l’outil dcode en ligne en visant le lien suivant

==[Décomposition en Facteurs Premiers - Factorisation en Ligne](https://www.dcode.fr/decomposition-nombres-premiers)==

  

  

## ==Sixième question: difference entre p et q==

il suffit de faire la difference des résultat trouvé entre p et q c’est a dire |p-q|

  

## ==Septième question : trouvé la clé privée==

pour trovué la clé privé , vu qu’on connais n ,e et d ( a partir de p et q) on peut utilisé le code suivant pour le faire

```Python
from Crypto.PublicKey import RSA
from Crypto.Util.number import inverse



n=... \#valeur de n


e = 65537


p=... # valeur de p

q=... # valeur de q

phi = (p-1)(q-1)  # pour trouvé la valeur de phi

d=inverse(e,n)


key = RSA.construct((n, e, d)) # pour reconstruire la clé

with open("id_rsa", "wb") as f: # ont crée le fichier id_rsa
    f.write(key.export_key())  # ont ecris notre clé réconstruire dans le fichier crée

print("[+] Clé privée RSA générée : id_rsa") # on affiche un message au cas où tous marche bien sinon on obtien une erreur
```

  

  

## ==huitième question : trouvé le flag==

pour trouvé le flag, il suffit de se connecté a la machine cible via le protocole ssh en utilisant la clé privé que vous avez reconstruite mais avant n’oublié pas de données une permission de 600 au fichier qui contient la clé privé

![image 5.png](/portofiolo/content/writeups/media/image-5.png)

  

Donc après connexion a la machine cible , vous pouvez faire un ls puis trouvé un fichier nomé flag puis ensuite cat pour afficher son contenue.
