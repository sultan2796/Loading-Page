const initialUsers = [
  {
    "ad": "Sultan",
    "soyad": "Tagiyev",
    "eposta": "ornek@mail.com",
    "sifre": "12345678"
  }
];

if (!localStorage.getItem("kayitliUser")) {
  localStorage.setItem("kayitliUser", JSON.stringify(initialUsers[0]));
}