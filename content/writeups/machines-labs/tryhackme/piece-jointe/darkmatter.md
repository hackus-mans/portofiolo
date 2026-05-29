
Dans ce challenge on nous donne la valeur de :

n =340282366920938460843936948965011886881

e = 65537


l'objectif est de retrouvé la valeur de d puis de l'entré dans le champs réservé par le ransomware pour déchiffré les informations 


Donc pour ce faire nous pouvons utilisé le code si dessous pour le faire. Mais avant de l'utilisé vous devez factorisé n en <font color="#92d050">p*q</font> 

```python
q=int(input("veuillez entrer la valeur de q :"))

p=int(input("veuillez entrer la valeur de p :"))

e = int(input("veuillez entrer la valeur de e :"))

phi = (p-1)*(q-1)

d = inverse(e, phi)

print(f"d = {d}")

```





