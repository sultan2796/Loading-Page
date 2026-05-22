const initialUsers = [
  {
    "ad": "Sultan",
    "soyad": "Tagiyev",
    "eposta": "ornek@mail.com",
    "sifre": "12345678"
  },
  {
    "ad": "Ali",
    "soyad": "Turk",
    "eposta": "ali@gmail.com",
    "sifre": "ali123456"
  }
];

if (!localStorage.getItem("kayitliUser")) {
  localStorage.setItem("kayitliUser", JSON.stringify(initialUsers[0]));
}