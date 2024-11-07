
// document.getElementById('url').textContent = window.location.href;

function toggleMenu() {
    const menu = document.querySelector(".dropdown-nav-list");
    const menuItem = document.querySelector(".dropdown-nav-list a");
    const icon = document.querySelector(".dropdown-nav-icon");

    menu.classList.toggle("open");
    menuItem.classList.toggle("open");
    icon.classList.toggle("open");
}

function toTop() {
    window.scrollTo(0, 0)
}
