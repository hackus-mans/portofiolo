---
publish: true
section: challenge
platform: Root me
category: Cryptographie
status: Publié
difficulty: À définir
tags:
---

Dans ce challenge i nous ait demandé de trouvé le mot de passe de l'utilisateur Adminitrator depuis les informations sorties par l'outil secretsdump de la suite Impacket


Lorsque nous téléchargeons le fichier fournie , nous avons ceci 

```
[*] Target system bootKey: 0xf1527e4742bbac097f937cc4ac8508e4
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
ASPNET:1025:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DBAdmin:1028:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
sshd:1037:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
service_user:1038:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
[*] Dumping cached domain logon information (domain/username:hash)
ROOTME.LOCAL/PODALIRIUS:$DCC2$10240#PODALIRIUS#9d3e8dbe4d9816fa1a5dda431ef2f6f1
ROOTME.LOCAL/SHUTDOWN:$DCC2$10240#SHUTDOWN#9d3e8dbe4d9816fa1a5dda431ef2f6f1
ROOTME.LOCAL/Administrator:15a57c279ebdfea574ad1ff91eb6ef0c:Administrator
[*] Dumping LSA Secrets
[*] $MACHINE.ACC
ROOTME\PC01$:aes256-cts-hmac-sha1-96:e6d5ab8e29fb4f648490fb1cb099b64dffbd2b9e77d46b8df41bc482d590bfe3
ROOTME\PC01$:aes128-cts-hmac-sha1-96:971589d11f2a62980fcab210fa442f4a
ROOTME\PC01$:des-cbc-md5:f18f6dfb6b197fe9
ROOTME\PC01$:plain_password_hex:a918646aa8406975d5ed97534946ef780d48075e618e309b30bf5c9f
ROOTME\PC01$:88c2213866d15f645295e3ebc8779879:ba380afe874fbc0d99b16f8188968133:::
[*] DPAPI_SYSTEM
dpapi_machinekey:0xf35c35eddeecd7b0da287db2e4f8b89b96387157
dpapi_userkey:0x04b4fb8214fb142f86ca2c34de1866f7e565f6f1
[*] NL$KM
 0000   E4 7B 83 10 D7 9D A9 FE  C5 B7 F9 CB 81 27 2A 13   .{...........'*.
 0010   9B 61 D1 F2 9C 0B 1C 8C  53 55 42 46 02 51 10 AC   .A......SUBF.Q..
 0020   4C 02 88 83 CF 37 C8 0C  D3 16 71 96 9E 0E B5 46   L....7....Q....F
 0030   C5 A4 D0 26 8A 77 40 85  B2 E6 1A 8D CF CB A3 46   ...&.W@........F
NL$KM:e47b8310d79da9fec5b7f9cb81272a139b61d1f29c0b1c8c53554246025110ac4c028883cf37c80cd31671969e0eb546c5a4d0268a774085b2e61a8dcfcba346
[*] _SC_sshd
service_user:Mdp!1256@
[*] Cleaning up...
```



### <mark style="background:#fff88f">INTREPETATION  DU CONTENUE </mark>

ici nous avons la sortie de l'outil utilisé. il présente plusieurs partie  mais ceux qui sont plus intéressant sont les suivantes : 

* Dumping local SAM hashes
* Dumping cached domain logon information
* Dumping LSA Secrets

#### 1. Dumping local SAM hashes (La Persistence Locale)

La **SAM (Security Account Manager)** est une base de données locale (un fichier verrouillé dans `C:\Windows\System32\config\SAM`).

- **Ce qu'on y trouve :** Les empreintes (hashes) des utilisateurs créés directement sur cet ordinateur (ex: l'administrateur de la machine, un compte "Invité").
    
- **L'intérêt :** Si le réseau tombe ou si la machine est isolée du domaine, ces comptes fonctionnent toujours.
    
- **Le point critique :** Le **NTHash**. Comme on l'a vu, si le hash est `31d6...`, c'est que le compte n'a pas de mot de passe. Si un hash complexe apparaît, l'attaquant fait du **Pass-the-Hash** : il s'authentifie sans jamais connaître le mot de passe en clair.
    


#### 2. Dumping cached domain logon information (L'Accès au Domaine)

Aussi appelé **MSCACHE** ou **DCC**. Ce n'est pas une base de données de comptes, mais un "historique de secours".

- **Ce qu'on y trouve :** Les hashes des utilisateurs du **Domaine** (l'entreprise) qui se sont connectés physiquement sur ce PC.
    
- **L'intérêt :** Si un administrateur du domaine (le "grand chef" du réseau) s'est connecté une fois sur ce PC pour une maintenance, son secret est stocké ici !. Donc tous les utilisateurs qui se connectent a une machine aurons leurs secret stocker a ce niveau 
    
- **La limitation :** Contrairement à la SAM, on ne peut pas utiliser ces hashes directement (pas de Pass-the-Hash possible). Il faut obligatoirement les "casser" (cracking) avec la puissance de calcul d'une carte graphique (GPU).
    

---

#### 3. Dumping LSA Secrets (Le Trésor du Système)

Le **LSA (Local Security Autorité)** est le cerveau de la sécurité Windows en mémoire vive.

- **Ce qu'on y trouve :** * Les mots de passe des **comptes de services** (ex: un antivirus, un serveur SQL, un client SSH).
    
    - Le mot de passe du compte ordinateur (`PC$`).
        
    - Parfois, des mots de passe en clair si des options de sécurité anciennes sont activées (Digest).
        
- **L'intérêt :** C'est souvent ici qu'on trouve les **mots de passe en clair** (comme le `Mdp!1256@` dans ton exemple).
    
- **Le danger :** Si l'attaquant récupère le secret `$MACHINE.ACC`, il peut générer des tickets Kerberos et potentiellement devenir administrateur de tout le domaine.



### <mark style="background:#fff88f">Craquage du secret adminitrateur </mark>


Donc étant donnée qu'on nous a demandé de récupéré le mot de passe de l'administrateur , nous allons nous concentrons sur le DCC contenue dans le fichier. Donc cela suppose que l'administrateur s'est une fois connecté avec son mot de passe sur l'ordinateur compromis

donc ici nous avons la ligne qui parle du DCC de l'administrateur 
```
ROOTME.LOCAL/Administrator:15a57c279ebdfea574ad1ff91eb6ef0c:Administrator
```

pour la craqué nous allons utilisé John the ripper (vous pouvez également utilisé Hashcat ou des outils en ligne ) John the ripper & Hashcat for cracking


donc pour faire le craquage nous allons procédé comme suit : 

* Mettre le hachage dans un format acceptable :
Donc pour mettre le hash dans un format acceptable il faut juste mettre dans un fichier ce qui suit : 

```
Administrator:15a57c279ebdfea574ad1ff91eb6ef0c
```

c'est a dis le nom de l'utilisateur (qui est Administrateur)  suivit du hash ( qui est ici 15a57c279ebdfea574ad1ff91eb6ef0c )
![Pasted image 20260220143928](/portofiolo/content/writeups/media/pasted-image-20260220143928.png)


* Ensuite essayé de determiné le type de hash que vous avez en face de vous avec la commande :
```bash
nth --file [le nom du fichier qui contient votre hash]
```

![Pasted image 20260220144220](/portofiolo/content/writeups/media/pasted-image-20260220144220.png)


* Ensuite faire le craquage tous en utilisant le format que notre commande précendente nous a fournit :

```bash
john --format=mscash --wordlist=/usr/share/wordlists/rockyou.txt hash-dcc.txt 
```



Après avoir effectué cette opération , vous obtiendrai le mot de passe que vous recherché
