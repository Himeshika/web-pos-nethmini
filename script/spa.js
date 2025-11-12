$(function () {
    const statusDot = document.getElementById('statusDot');
    const logoutBtn = document.getElementById('logoutBtn');

    let isLoggedIn = false;

    const title = $("#navbar-title_id");

    let users = [{
        username: "admin",
        password: "12345"
    }];

    // Initial padding for title
    title.css("padding-left", "0");
    title.css("padding-right", "150px");

    // ===== Login Button =====
    $('#login_btn').on('click', function () {
        let enteredUsername = $('#login_username').val()?.trim();
        let enteredPassword = $('#login_password').val()?.trim();

        if (users[0].username === enteredUsername && users[0].password === enteredPassword) {
            // Show Customer section after login
            $('#customer').removeClass('d-none');
            $('#login').addClass('d-none');
            $('#nav_list').removeClass('d-none');
            title.css("padding-left", "400px");
            title.css("padding-right", "0");
            isLoggedIn = true;
            updateProfileStatus();
            $('#login_username').val('');
            $('#login_password').val('');

            Swal.fire({
                title: "Login Successful",
                icon: "success",
                timer: 1200,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                title: "Wrong Credentials",
                text: "Please enter a valid username or password!",
                icon: "error"
            });
        }
    });

    // ===== Navbar Tab Clicks =====
    $('#cus_tab').on('click', function () {
        $('#customer').removeClass('d-none');
        $('#item').addClass('d-none');
        $('#order').addClass('d-none');
        $('#order_history').addClass('d-none');
        title.text("Customer");
    });

    $('#item_tab').on('click', function () {
        $('#customer').addClass('d-none');
        $('#item').removeClass('d-none');
        $('#order').addClass('d-none');
        $('#order_history').addClass('d-none');
        title.text("Item");
    });

    $('#order_tab').on('click', function () {
        $('#customer').addClass('d-none');
        $('#item').addClass('d-none');
        $('#order').removeClass('d-none');
        $('#order_history').addClass('d-none');
        title.text("Order");
    });

    $('#order_history_tab').on('click', function () {
        $('#customer').addClass('d-none');
        $('#item').addClass('d-none');
        $('#order').addClass('d-none');
        $('#order_history').removeClass('d-none');
        title.text("Order History");
    });

    // ===== Nav Card Clicks =====
    $('#cus_card').on('click', function () {
        $('#customer').removeClass('d-none');
        $('#item').addClass('d-none');
        $('#order').addClass('d-none');
        $('#order_history').addClass('d-none');
        title.text("Customer");
    });

    $('#item_card').on('click', function () {
        $('#customer').addClass('d-none');
        $('#item').removeClass('d-none');
        $('#order').addClass('d-none');
        $('#order_history').addClass('d-none');
        title.text("Item");
    });

    $('#order_card').on('click', function () {
        $('#customer').addClass('d-none');
        $('#item').addClass('d-none');
        $('#order').removeClass('d-none');
        $('#order_history').addClass('d-none');
        title.text("Order");
    });

    // ===== Profile Status =====
    function updateProfileStatus() {
        if (isLoggedIn) {
            statusDot.style.backgroundColor = 'green';
        } else {
            statusDot.style.backgroundColor = 'red';
        }
    }

    // ===== Logout =====
    logoutBtn.addEventListener('click', () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You’ll be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                isLoggedIn = false;
                updateProfileStatus();
                $('#customer').addClass('d-none');
                $('#item').addClass('d-none');
                $('#order').addClass('d-none');
                $('#order_history').addClass('d-none');
                $('#login').removeClass('d-none');
                $('#nav_list').addClass('d-none');
                title.css("padding-left", "0");
                title.css("padding-right", "150px");

                Swal.fire({
                    title: "Logged out!",
                    text: "You have been successfully logged out.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
});
