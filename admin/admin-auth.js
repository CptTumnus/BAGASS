// ==========================================
// BAGASS Admin - Auth Guard
// Included by every admin subpage except index.html
// ==========================================

(function () {

    function getCookie(name) {
        const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : null;
    }

    if (!getCookie("bagass_admin_token")) {
        window.location.replace("index.html");
    }

})();
