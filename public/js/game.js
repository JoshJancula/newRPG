$(document).ready(function() {
    $("#randomAction").hide();
    $("#message").text("Welcome Homie!!! Click below to do some gangsta shit!");
    $("#optionButtons2").hide();
    $('.modal').modal();
    $('select').material_select();


    // setup and initialize the game
    //==================================
    var money;
    var health;
    var maxHealth = 200;
    var strength;
    var defense;
    var streetCredit;
    var level;
    var username;
    var userId;
    var inventory;
    var weaponId;
    var oldQ;
    var doesExist = false;
    var hasCar = false;
    var hasAR15 = false;
    var initialImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4qtdy8-TptQ_xERtVxeYMD3s-ghqms8CD0x1fIdJkHGWcbXY";
    $("#actionImage").attr('src', initialImage);

    // load the option buttons
    loadOptions2(); // load level 2 options
    loadOptions();


    // get the data of current user
    $.get("api/user_data", {}, function(data) {}).done(function(data) {
        userId = data.id;
        $("#username").text(data.username);
        username = data.username;
        $("#health").text("Your Health: " + data.health);
        maxHealth = data.health;
        health = data.health;
        $("#strength").text(data.strength);
        strength = data.strength;
        $("#money").text("You Have: $" + data.money);
        money = data.money;
        $("#level").text("Level: " + data.level);
        level = data.level;
        if (level > 1) { // if we're higher than level 1
            $("#optionButtons2").show();
        }
        $("#streetCredit").text("Street Credit: " + data.streetCredit);
        streetCredit = data.streetCredit;
        $("#defense").text(data.defense);
        defense = data.defense;
        // get that users inventory
        $.get("/api/users/" + userId, function(data) {
            console.log("Weapons", data);
            inventory = data.Weapons;
            if (inventory.length != 0) {
                // go get their weapons
                getWeapons(inventory)
            }
            else { // show theres nothing there
                displayEmpty();
            }
        });
    });

    // if they don't have any yet
    function displayEmpty() {
        // there is nothing in here so....

        $("#instructions").html("<h3>You don't have any weapons yet</h3>");
    }


    function getWeapons(data) {

        $("#weaponsDiv").show();
        // create a card to put it all in
        var div = $("<div class='card'>");
        data.forEach(function(result) {

            var div = $("<div>").append(
                "<div class='row'>" +
                "<div class='col l10 s12'>" + "<div class='card'>" + "<div class='card-image col l4 s12'>" + "<img class='weaponImage' src=" + result.image + ">" +
                "</div>" +
                "<div class='card-stacked'>" + "<div class='card-content'>" +
                "<h2>" + result.name + "</h2>" +
                "<p> Quantity: " + result.quantity + "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
            );
            if (result.type == "drug") {
                $('#instructions').hide();
                $("#myDrugs").append(div);
            }
            else if (result.type == "gun") {
                $("#myGuns").append(div);
            }
            else if (result.type == "car") {
                $("#myCars").append(div);
                $('#instructions2').hide();
                hasCar = true;
            }
            else if (inventory[i].name == "AR-15" && inventory[i].quantity >= 4) {
                    hasAR15 = true;
                }

            $("#instructions").html("<h3>You don't have any drugs to sell</h3>");
            $("#instructions2").html("<h3>You don't have a car</h3>");

        });

    }


    // delete user account
    $("#handleDelete").click(function() {
        // get the users id
        $.get("api/user_data", {}, function(data) {
            let id = data.id
            console.log("email1: " + id);
        }).done(function(user) {
            $.ajax({ // go delete that shit
                method: "DELETE",
                url: "/api/users/" + user.id
            }).done(function(data) { // tell me something good
                console.log("delete was successful: " + JSON.stringify(data));
                window.location.href = '/logout'; // redirect to login page
            });
        });
    });

    // to update and save your user
    function updateUser(info) {
        console.log("username at begining of update: " + username)
        console.log("before updateUser ajax: " + JSON.stringify(info));
        $.ajax({
            method: "PUT",
            url: "/api/users/username",
            username,
            data: info
        }).done(function(data) {
            console.log("data from updateUser: " + JSON.stringify(data));
        });
    };


    // saves the weapon you purchased
    function saveWeapon(weapon) {
       
        $.post("/api/weapons", weapon, function() {
             setTimeout(function(){
            $.get("/api/users/" + userId, function(data) {
                console.log("data from saveWeapon", data);
                $("#myGuns").empty();
                $("#myDrugs").empty();
                $("#myCars").empty();
                inventory = data.Weapons;
                // show em what they got
                getWeapons(inventory);
            });
        });
        });
    }


    function inventoryUpdate(newInventory, weaponId) {
        $.ajax({
            method: "PUT",
            url: "/api/weapons/" + weaponId,
            data: newInventory
        }).done(function() {
            $.get("/api/users/" + userId, function(data) {
                console.log("data from saveWeapon", data);
                $("#myGuns").empty();
                $("#myDrugs").empty();
                $("#myCars").empty();
                inventory = data.Weapons;
                // show em what they got
                getWeapons(inventory);
            });
        });
    }



    //  Begin main game area
    //============================================

    // weapons array contains all weapons and
    var weapons = [ //  cars and things you can buy

        {
            index: 0,
            name: "glock 19",
            type: "gun",
            value: 2,
            price: 250,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPYHLRfrAkTO6ajbO4r7S2E10vLDcAV8ijUDYZ5hSH-9G7_qU9g"

        },
        {
            index: 1,
            name: "Saturday Night Special",
            type: "gun",
            value: 1,
            price: 150,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA7ZmUBnDe2ea1TPaQhSDdVFtDZdnx74f5odTLRKuEJSl78XDF"

        },
        {
            index: 2,
            name: "12 Gauge Shotgun",
            type: "gun",
            value: 3,
            price: 350,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKwsioPeIDOOvSe1nZ3JUCAASasnKiVcjNPB8Y3iHCSzxnnUJT"

        },
        {
            index: 3,
            name: "Uzi",
            type: "gun",
            value: 3,
            price: 400,
            level: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSITK7vscJIwgCqfYkR_DZAO6HtqlSZg9EjlfldgspLE3dQ6YeN"

        },
        {
            index: 4,
            name: "Crack",
            type: "drug",
            value: 120,
            price: 50,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfJ7FZxFm-UzSkae6t5kB-k1uZL0psxJTvMW7i9gDqSvk9WgST"
        },

        {
            index: 5,
            name: "Weed",
            type: "drug",
            value: 100,
            price: 40,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYyiFYOZ5Gd4CNi1jncb-0QBtd2L6ikIcpEka6NgUfeAIDil-j"
        },
        {
            index: 6,
            name: "Caddy",
            type: "car",
            value: 100,
            price: 1000,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcOr9hhEzkGgVMKBtEP6yRDzjIoqismQ8NIswrr-OFrOk4KnaSVQ"
        },
        {
            index: 7,
            name: ".22",
            type: "gun",
            value: 1,
            price: 100,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TIR9nMSzRL5_WR1XTv0HgNSeZnjK95vEC-yoQtGyteoI7csArg"
        },
        {
            index: 8,
            name: "AR-15",
            type: "gun",
            value: 4,
            price: 1200,
            level: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScKoEXFr-TZWuHdBldTfrYKsMbvaPtv6A3QDgzHJLSEhoxpO4Z-w"
        },
         {
            index: 9,
            name: "Cutless",
            type: "car",
            value: 4,
            price: 2500,
            level: 1,
            image: "http://media.motortopia.com/files/33278/vehicle/4fc16de89e27f/DSC00012.jpg"
        },


    ];

    showWeapons()
    // function to show the weapons for sale
    function showWeapons() {
        weapons.forEach(function(result) {

            var div = $("<div>").append(
                "<div class='row'>" +
                "<div class='col l10 s12'>" + "<div class='card inventoryCard'>" + "<div class='card-image col l4 s12'>" + "<img class='weaponImage' src=" + result.image + ">" +
                "</div>" +
                "<div class='card-stacked'>" + "<div class='card-content'>" +
                "<h2>" + result.name + "</h2>" +
                "<p> $" + result.price + "</p>" +
                "<button class='btn purchase' value='" + result.index + "'>Purchase</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
            );

            if (result.type == "drug") {
                $("#drugs").append(div);
            }
            else if (result.type == "gun") {
                $("#guns").append(div);
            }
            else if (result.type == "car") {
                $("#cars").append(div);
            }

        });
    }

    function checkInventory(k) {
        if (inventory.length != 0) {
            for (var i = 0; i < inventory.length; i++) {
                if (inventory[i].name == weapons[k].name) {
                    doesExist = true;
                    weaponId = inventory[i].id;
                    oldQ = inventory[i].quantity;
                    console.log("doesExist: " + doesExist);
                    console.log("weaponId: " + weaponId);
                }
                else if (inventory[i].type == "car") {
                    // update hasCar
                    hasCar = true;
                }
                else if (inventory[i].name == "AR-15" && inventory[i].quantity >= 4) {
                    hasAR15 = true;
                }
            }
        }
    }


    function performUpdate(k) {
        // get the quantity 
        var quantity = parseInt($("#quantityInput").val());
        if (!quantity || quantity.val == "") {
            quantity = 1;
        }
        // update display
        let name = weapons[k].name;
        let value = weapons[k].value;
        let image = weapons[k].image;
        let type = weapons[k].type;

        // tell them they bought it 
        if (type == "drug") {
            $("#message").text("You bought " + quantity + " bag(s) of " + name);
            $("#actionImage").attr('src', image)
            // $('#modal1').modal('open');
        }
        else  {
            $("#message").text("You bought " + quantity + " " + name);
            $("#actionImage").attr('src', image)
        }
        // update money display
        $("#money").text("You Have: $" + money);
        // if one already exists...
        if (doesExist == true) {
            oldQ += quantity;
            let newInventory = {
                quantity: oldQ,
            } // update the inventory 
            inventoryUpdate(newInventory, weaponId);
        }
        else { // if one doesn't...
            // create a new weapon in inventory
            let weapon = {
                name: name,
                value: value,
                quantity: quantity,
                image: image,
                type: type,
                gameUserId: userId
            }; // save it
            saveWeapon(weapon);
        } // reset doesExist
        doesExist = false;
        $("#quantityInput").val("");
    }

    // when you click to purchase something ask how many they want
    $(document).on("click", ".purchase", function() {
        var k = $(this).attr("value");
        $("#completePurchase").attr('value', k);
        // ask how many units to purchase
        $("#message2").text("How many would you like to purchase?");
        $("#actionImage2").attr('src', weapons[k].image);
        $('#modal2').modal('open');
    });


    // complete the purchase
    $(document).on("click", "#completePurchase", function(event) {
        event.preventDefault();
        // use the index value to get info
        var quantity = $("#quantityInput").val();
        if (!quantity || quantity.val == "") {
            quantity = 1;
        }
        var k = $(this).attr("value");
        var total = (weapons[k].price * quantity);
        // check inventory
        checkInventory(k);
        // check if they have enough money
        if (total > money) {
            $("#randomAction").show();
            $("#actionImage").hide();
            $("#message").text("You don't have enough $$$$$$$");
            $("#quantityInput").val("");
        }
        else { // if they do, update the user and weapon data
            // do the math
            money -= total;
            // update your character
            let info = {
                username: username,
                health: health,
                defense: defense,
                strength: strength,
                money: money,
                level: level,
                streetCredit: streetCredit,
            } // update user 
            updateUser(info);
            // perform update 
            performUpdate(k);
            // setTimeout(function() {
            //     performUpdate(k);
            // }, 1000)
        }
    });


    // original level 1 options
    //===================================================

    var pimp = [ // you pimp some hoes
        {
            scenario: "Your bitches did good tonight! Made $500",
            health: 0,
            money: 500,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwKaDVOpPshFWeUdxueoBlCJ4G_oBaZOLW2VRaY5KPCtak6Oj8Ng"
        },
        {
            scenario: "Your bitches did good tonight! Made $500",
            health: 0,
            money: 500,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwKaDVOpPshFWeUdxueoBlCJ4G_oBaZOLW2VRaY5KPCtak6Oj8Ng"
        },
        {
            scenario: "Two of your Hoes got Locked up! It's going to cost $300 to bail them out",
            health: 0,
            money: -300,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AAvizxZgXEhSqcfRI4f3LWOpgHt3XsY7aYgQ2qR_u-D3OdGE"

        },
        {
            scenario: "It's been hard on the girls, only made $100 tonight",
            health: 0,
            money: 100,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "It's been hard on the girls, only made $200 tonight",
            health: 0,
            money: 200,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "One of your girls got caught soliciting to a cop and snitched! Pay $600 to get you and your hoes outta jail.",
            health: 0,
            money: -600,
            streetCredit: -30,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AAvizxZgXEhSqcfRI4f3LWOpgHt3XsY7aYgQ2qR_u-D3OdGE"
        },
        {
            scenario: "Your bitches did good tonight! Made $1000",
            health: 0,
            money: 1000,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwKaDVOpPshFWeUdxueoBlCJ4G_oBaZOLW2VRaY5KPCtak6Oj8Ng"
        },
    ]

    var sellWeed = [ // sell some weed scenarios
        {
            scenario: "You got popped selling to an undercover cop! $150 for bail bro!",
            health: 0,
            money: -150,
            streetCredit: -20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },

        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got busted by the cops! $150 for bail bro!",
            health: 0,
            money: -150,
            streetCredit: 20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
    ]


    var sellCrack = [ // sell crack
        {
            scenario: "You got popped selling to an undercover cop! $250 for bail bro!",
            health: 0,
            money: -250,
            streetCredit: -20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You got stabbed by a crackhead! You'll live but he got $50 worth of crack!",
            health: 0,
            money: 0,
            streetCredit: -20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr3loD0g6Kq9Bc7MoIm_sZs0qcZKXoY-J_2P9FE-w4jBKnunWn8w"
        },

        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 150,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got busted by the cops! $250 for bail bro!",
            money: -250,
            streetCredit: 20,
            health: -20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 150,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Deal Successfull! But somebody robbed one of your guys!!",
            health: 0,
            money: -100,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmoybOow9XsNXixlzQYm0JBJc3eXepNkr1nkc4n9xfWmgCPpZ5"
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 150,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },

    ];

    // do a drive-by on some
    var driveBy = [ // punk mofos

        {
            scenario: "You hit 2 of their members, but your home-boy Reggie got shot!",
            money: 0,
            streetCredit: 30,
            health: -50,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xfH-ij-CraeFOC9_mPVgqpWV33fw9_RAO7tqopU4_xzRUGlb"
        },
        {
            scenario: "You got busted by the cops! $500 for bail bro!",
            money: -150,
            streetCredit: 20,
            health: -20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You capped some Mofo's!",
            health: 0,
            money: 0,
            streetCredit: 25,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xfH-ij-CraeFOC9_mPVgqpWV33fw9_RAO7tqopU4_xzRUGlb"

        },
        {
            scenario: "You capped some Mofo's!",
            health: 0,
            money: 0,
            streetCredit: 25,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xfH-ij-CraeFOC9_mPVgqpWV33fw9_RAO7tqopU4_xzRUGlb"

        },
        {
            scenario: "You hit one but they shot back and you got hit, $500 for a doctor to keep it quiet",
            money: -500,
            health: -60,
            streetCredit: -30,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWvxg-kUceymX0S7vvr0LtqnbwxoqbtL8SBmbhqrMpU-I1M7z-7A"
        },
        {
            scenario: "Hell Yea Boy! You capped a Mofo",
            health: 0,
            money: 0,
            streetCredit: 25,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xfH-ij-CraeFOC9_mPVgqpWV33fw9_RAO7tqopU4_xzRUGlb"
        },

    ];


    // do a B&E
    var BE = [

        {
            scenario: "You got $600 but your home-boy Reggie got shot! You give him $250 to keep a doctor quiet",
            money: 350,
            streetCredit: 15,
            health: -50,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWvxg-kUceymX0S7vvr0LtqnbwxoqbtL8SBmbhqrMpU-I1M7z-7A"
        },
        {
            scenario: "You got busted by the cops! $150 for bail bro!",
            health: -10,
            money: -150,
            streetCredit: -20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You got caught by the cops! $250 for bail bro!",
            health: 0,
            money: -250,
            streetCredit: -20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You found $200 in the nightstand!",
            health: 0,
            money: 200,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"

        },
        {
            scenario: "You got some jewelery, but also got bit by a pitt bull! ",
            money: 150,
            health: -25,
            streetCredit: -10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb5YS3bhPdyxqp2x4a0N6GTFJQQEdqNOo1BsrYTUOg-Dd2ru_duQ"
        },

        {
            scenario: "Got yourself a flat screen TV and pawned it for $200!",
            health: 0,
            money: 200,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPctm2un1ph8DhJcJhrbHzdwl94yzxUkdJeY4JZzXWzp-SyRSgSQ"
        },

    ];

    // when you rob an innocent pedestrian
    var robGS = [

        {
            scenario: "Got $60!",
            health: 0,
            money: 60,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $200!",
            health: 0,
            money: 200,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $60!",
            health: 0,
            money: 60,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $80!",
            health: 0,
            money: 80,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $40!",
            health: 0,
            money: 40,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $100!",
            health: 0,
            money: 100,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "An off duty officer shot you! Pay $400 in bail and hospital fees",
            health: -50,
            streetCredit: 20,
            money: -400,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You got shot by the store clerk running out the door! You made out with $300 dollars but gotta pay a doctor $500 to keep queit!",
            health: -50,
            streetCredit: 20,
            money: -200,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWvxg-kUceymX0S7vvr0LtqnbwxoqbtL8SBmbhqrMpU-I1M7z-7A'
        },
    ];

    // when you rob an innocent pedestrian
    var robPedestrian = [

        {
            scenario: "Got $60!",
            health: 0,
            money: 60,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $60!",
            health: 0,
            money: 60,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $80!",
            health: 0,
            money: 80,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $40!",
            health: 0,
            money: 40,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Got $100!",
            health: 0,
            money: 100,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got busted by the cops and they beat your ass! Pay $250 in bail",
            health: -50,
            streetCredit: -20,
            money: -250,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
    ];



    //  level 2 options
    //===================================================

    // possibilities for when 
    var robDealer = [ // you rob a dealer
        {
            scenario: "That mothaFucka shot you! Pay $500 for a doctor to keep it quiet.",
            health: -50,
            money: -500,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWvxg-kUceymX0S7vvr0LtqnbwxoqbtL8SBmbhqrMpU-I1M7z-7A"
        },
        {
            scenario: "You got $250 off that punk",
            health: 0,
            money: 250,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got $1000 off that punk. In retaliation him and his crew robbed your home boy Quincy's place. They shot him and made out with $600",
            health: -40,
            money: 400,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got $250 off that punk",
            health: 0,
            money: 250,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got his stash and flipped it for $400 but he shot your boy Jarvis!",
            health: 0,
            money: 400,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        }
    ];


    var robBank = [ // you rob a bank
        {
            scenario: "Hell Yea!!!!!!!!!!!! You got a quick $20,000 to split with your boys!",
            health: 0,
            money: 5000,
            streetCredit: 50,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You got $1000 off the teller but your boy Tabarius got shot by the security guard!",
            health: -50,
            money: 250,
            streetCredit: 10,
           image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Someone in your crew snitched to the cops! They were waiting for you! Pay $1000 in bail!",
            health: -20,
            money: -1000,
            streetCredit: -40,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4XoUWXqSxZguyaQ9VNWwBpmulrbgFa1BDFa5boCsXulT0mEzw"
        },
        {
            scenario: "Your crew bitched out on you at the last minute! That ain't gangsta!",
            health: -10,
            money: 0,
            streetCredit: -30,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4XoUWXqSxZguyaQ9VNWwBpmulrbgFa1BDFa5boCsXulT0mEzw"
        },
        {
            scenario: "You got $5,000 really quick off the teller but lost 2,000 of it due to an exploding dye pack!",
            health: 0,
            money: 750,
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        }
    ];


    // create buttons to trigger all these scenarios
    function loadOptions() {
        var optionValue = ["robPedestrian", "robGS", "BE", "driveBy", "sellCrack", "sellWeed", "pimp"];
        var options = ["Rob a Pedestrian", "Rob a Gas Station", "Do a B&E", "Drive-By Shooting", "Sell Crack", "Sell Weed", "Pimp Hoes"]
        for (var i = 0; i < options.length; i++) {
            var div = $("<button value='" + i + "' class='btn optionButtons col l0 s10 push-s1'>");
            div.attr("id", optionValue[i]);
            div.text(JSON.stringify(options[i]));
            $("#optionButtons").append(div);
        }
    }


    // hidden options show when you are level 2
    function loadOptions2() {
        var optionValue = ["robBank", "robDealer"];
        var options2 = ["Rob a Bank", "Rob a Drug Dealer"]
        for (var i = 0; i < options2.length; i++) {
            var div = $("<button value='" + i + "' class='btn optionButtons col l0 s10 push-s1'>");
            div.attr("id", optionValue[i]);
            div.text(JSON.stringify(options2[i]));
            $("#optionButtons2").append(div);
        }
    }


    // function to shuffle the arrays around
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // function to watch health meter and update it every few seconds
    function updateHealth() {
        if (health < maxHealth) {
            if (health <= 0) { // if you are dead...
                $("#message").text("You Died!");
                $("#actionImage").hide();
                $("#randomImage").show();
                // $('#modal1').modal('open');
                health = maxHealth;
                money = 500;
                streetCredit = 0;
                let info = {
                    username: username,
                    health: health,
                    defense: defense,
                    strength: strength,
                    money: money,
                    level: level,
                    streetCredit: streetCredit,
                } // update your character
                updateUser(info); // update text fields
                $("#health").text("Your Health: " + health);
                $("#level").text("Level: " + level);
                $("#money").text("You Have: $" + money);
                $("#streetCredit").text("Street Credit: " + streetCredit);
            }
            else {
                health += 1;
                $("#health").text("Your Health: " + health);
                setTimeout(updateHealth, 25000);
            }
        }
    }


    // when you advance to next level
    function levelUp() {
        if (streetCredit >= 300) {
            level += 1;
            money += 500;
            health = maxHealth
            streetCredit = 0;
            strength += 1;
            defense += 1;
            let info = {
                username: username,
                health: health,
                defense: defense,
                strength: strength,
                money: money,
                level: level,
                streetCredit: streetCredit,
            } // update your character
            updateUser(info); //update text fields
            $("#health").text("Your Health: " + health);
            $("#level").text("Level: " + level);
            $("#money").text("You Have: $" + money);
            $("#streetCredit").text("Street Credit: " + streetCredit);
            $("#actionImage").hide();
            $("#message").text("Congrats Homie! You are now level: " + level);
            // $('#modal1').modal('open');
        }
        else if (level >= 2) {
             $("#optionButtons2").show();
        }
    }


    // when you click on saveGame
    $(document).on("click", "#saveGame", function() {
        let info = {
            username: username,
            defense: defense,
            strength: strength,
            money: money,
            level: level,
            streetCredit: streetCredit,
        } // update your character
        $("#actionImage").hide();
        $("#message").text("Save Successfull");
        // $('#modal1').modal('open');
        updateUser(info);
    });

    // when you click on saveGame
    $(document).on("click", "#saveGame2", function() {
        let info = {
            username: username,
            defense: defense,
            strength: strength,
            money: money,
            level: level,
            streetCredit: streetCredit,
        } // update your character
        $("#actionImage").hide();
        $("#message").text("Save Successfull");
        // $('#modal1').modal('open');
        updateUser(info);
    });

    // when you click on rob pedestrian
    $(document).on("click", "#robPedestrian", function() {
        $("#randomAction").hide();
        // shuffle the scenarios around
        shuffleArray(robPedestrian);
        // get the one off the end
        var currentScenario = robPedestrian.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
         $("#actionImage").show();
        // $('#modal1').modal('open');
        // get info to update
        health += Math.floor(currentScenario.health + ((defense + 5) / strength));
        money += currentScenario.money;
        streetCredit += currentScenario.streetCredit;
        // update display
        $("#health").text("Your Health: " + health);
        $("#money").text("You Have: $" + money);
        $("#streetCredit").text("Street Credit: " + streetCredit);
        // run the functions
        updateHealth();
        levelUp();
    });


    // when you click on rob robdDealer
    $(document).on("click", "#robDealer", function() {
        $("#randomAction").hide();
        // shuffle the scenarios around
        shuffleArray(robDealer);
        // get the one off the end
        var currentScenario = robDealer.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
           $("#actionImage").show();
        // $('#modal1').modal('open');
        // get info to update
        health += Math.floor(currentScenario.health + ((defense + 5) / strength));
        money += currentScenario.money;
        streetCredit += currentScenario.streetCredit;
        // update display
        $("#health").text("Your Health: " + health);
        $("#money").text("You Have: $" + money);
        $("#streetCredit").text("Street Credit: " + streetCredit);
        // run the functions
        updateHealth();
        levelUp();
    });


    // when you click on rob robGs
    $(document).on("click", "#robGS", function() {
        $("#randomAction").hide();
        // shuffle the scenarios around
        shuffleArray(robGS);
        // get the one off the end
        var currentScenario = robGS.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $("#actionImage").show();
        // $('#modal1').modal('open');
        // get info to update
        health += Math.floor(currentScenario.health + ((defense + 5) / strength));
        money += currentScenario.money;
        streetCredit += currentScenario.streetCredit;
        // update display
        $("#health").text("Your Health: " + health);
        $("#money").text("You Have: $" + money);
        $("#streetCredit").text("Street Credit: " + streetCredit);
        // run the functions
        updateHealth();
        levelUp();
    });

    // when you click on do a B&E
    $(document).on("click", "#BE", function() {
        $("#randomAction").hide();
        // shuffle the scenarios around
        shuffleArray(BE);
        // get the one off the end
        var currentScenario = BE.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $("#actionImage").show();
        // $('#modal1').modal('open');
        // get info to update
        health += Math.floor(currentScenario.health + ((defense + 5) / strength));
        money += currentScenario.money;
        streetCredit += currentScenario.streetCredit;
        // update display
        $("#health").text("Your Health: " + health);
        $("#money").text("You Have: $" + money);
        $("#streetCredit").text("Street Credit: " + streetCredit);
        // run the functions
        updateHealth();
        levelUp();
    });


    // when you click on rob a bank
    $(document).on("click", "#robBank", function() {
        $("#randomAction").hide();
        var k = $(this).attr("value");
        checkInventory(k)
        console.log("has AR15: " + hasAR15)
        if (hasAR15 == true) {
            // shuffle the scenarios around
            shuffleArray(robBank);
            // get the one off the end
            var currentScenario = robBank.slice(-1)[0];
            // tell them what happened
            console.log(robBank[0].image)
            $("#actionImage").attr('src', robBank[0].image);
            $("#message").text(currentScenario.scenario);
            $("#actionImage").show();
            // $('#modal1').modal('open');
            // get info to update
            health += Math.floor(currentScenario.health + ((defense + 5) / strength));
            money += currentScenario.money;
            streetCredit += currentScenario.streetCredit;
            // update display
            $("#health").text("Your Health: " + health);
            $("#money").text("You Have: $" + money);
            $("#streetCredit").text("Street Credit: " + streetCredit);
            // run the functions
            updateHealth();
            levelUp();
        }
        else {
            $("#randomAction").show();
            $("#actionImage").hide();
            $("#message").text("You need to have at least 4 AR-15's to rob a bank!");
            // $('#modal1').modal('open');
        }
    });


    // when you click on do a drive-by
    $(document).on("click", "#driveBy", function() {
        $("#randomImage").hide();
        var k = $(this).attr("value");
        checkInventory(k)
        if (hasCar == true) {
            // shuffle the scenarios around
            shuffleArray(driveBy);
            // get the one off the end
            var currentScenario = driveBy.slice(-1)[0];
            // tell them what happened
            console.log(driveBy[0].image)
            $("#actionImage").attr('src', driveBy[0].image);
            $("#message").text(currentScenario.scenario);
            $("#actionImage").show();
            // $('#modal1').modal('open');
            // get info to update
            health += Math.floor(currentScenario.health + ((defense + 5) / strength));
            money += currentScenario.money;
            streetCredit += currentScenario.streetCredit;
            // update display
            $("#health").text("Your Health: " + health);
            $("#money").text("You Have: $" + money);
            $("#streetCredit").text("Street Credit: " + streetCredit);
            // run the functions
            updateHealth();
            levelUp();
        }
        else {
            $("#randomAction").show();
            $("#actionImage").hide();
            $("#message").text("You have to own a car to do a drive-by!");
            // $('#modal1').modal('open');
        }
    });



    // when you click on sell crack
    $(document).on("click", "#sellCrack", function() {
        $("#randomAction").hide();
        var k = $(this).attr("value");
        console.log("K at the beggining of sellCrack: " + k)
        // check inventory
        checkInventory(k);
        if (doesExist == false || oldQ < 1) {
            // they don't have any to sell
            $("#actionImage").attr('src', weapons[k].image);
            $("#message").text("You don't have any crack to sell!");
            // $('#modal1').modal('open');
        }
        else { // update the inventory
            let newQ = (oldQ - 1);
            let newInventory = {
                quantity: newQ,
            } // update the inventory 
            inventoryUpdate(newInventory, weaponId);
            // shuffle the scenarios around
            shuffleArray(sellCrack);
            // get the one off the end
            var currentScenario = sellCrack.slice(-1)[0];
            // tell them what happened
            $("#actionImage").attr('src', currentScenario.image);
            $("#actionImage").show();
            $("#message").text(currentScenario.scenario);
            // $('#modal1').modal('open');
            // get info to update
            health += Math.floor(currentScenario.health + ((defense + 5) / strength));
            money += currentScenario.money;
            streetCredit += currentScenario.streetCredit;
            // update display
            $("#health").text("Your Health: " + health);
            $("#money").text("You Have: $" + money);
            $("#streetCredit").text("Street Credit: " + streetCredit);
            // run the functions
            updateHealth();
            levelUp();
            let info = { // update your user
                username: username,
                health: health,
                defense: defense,
                strength: strength,
                money: money,
                level: level,
                streetCredit: streetCredit,
            }
            updateUser(info);
        }
    });


    // when you click on sell weed
    $(document).on("click", "#sellWeed", function() {
        $("#randomAction").hide();
        var k = $(this).attr("value");
        console.log("K at the beggining of sellWeed: " + k)
        // check inventory
        checkInventory(k);
        if (doesExist == false || oldQ < 1) {
            // they don't have any to sell
            $("#actionImage").attr('src', weapons[k].image);
            $("#message").text("You don't have any weed to sell!");
            // $('#modal1').modal('open');
        }
        else { // update the inventory
            let newQ = (oldQ - 1);
            let newInventory = {
                quantity: newQ,
            } // update the inventory 
            inventoryUpdate(newInventory, weaponId);
            // shuffle the scenarios around
            shuffleArray(sellWeed);
            // get the one off the end
            var currentScenario = sellWeed.slice(-1)[0];
            // tell them what happened
            $("#actionImage").attr('src', currentScenario.image);
            $("#message").text(currentScenario.scenario);
            $("#actionImage").show();
            // $('#modal1').modal('open');
            // get info to update
            health += Math.floor(currentScenario.health + ((defense + 10) / strength));
            money += currentScenario.money;
            streetCredit += currentScenario.streetCredit;
            // update display
            $("#health").text("Your Health: " + health);
            $("#money").text("You Have: $" + money);
            $("#streetCredit").text("Street Credit: " + streetCredit);
            // run the functions
            updateHealth();
            levelUp();
            let info = { // update your user
                username: username,
                health: health,
                defense: defense,
                strength: strength,
                money: money,
                level: level,
                streetCredit: streetCredit,
            }
            updateUser(info);
        }
    });

    // when you click on pimp hoes
    $(document).on("click", "#pimp", function() {
        $("#randomAction").hide();
        // shuffle the scenarios around
        shuffleArray(pimp);
        // get the one off the end
        var currentScenario = pimp.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
         $("#actionImage").show();
        // $('#modal1').modal('open');
        // get info to update
        health += Math.floor(currentScenario.health + ((defense + 5) / strength));
        money += currentScenario.money;
        streetCredit += currentScenario.streetCredit;
        // update display
        $("#health").text("Your Health: " + health);
        $("#money").text("You Have: $" + money);
        $("#streetCredit").text("Street Credit: " + streetCredit);
        // run the functions
        updateHealth();
        levelUp();

    });




    // random scenarios that pop up
    //===================================

    var randomScenarios = [{
            scenario: "You were out slinging crack and got stabbed by a crackhead! He ran off with $20 worth of crack",
            health: -50,
            money: -20,
            streetCredit: -20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr3loD0g6Kq9Bc7MoIm_sZs0qcZKXoY-J_2P9FE-w4jBKnunWn8w"
        },
        {
            scenario: "The cops ran up on one of your stash houses! They didn't get shit but now your boy Tabarius is locked up on a warrant charge. Pay $300 to protect him in jail.",
            health: 0,
            money: -300,
            streetCredit: 40,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You and your boys saw some punks slingin' on your corner! You beat some ass and jacked $400 off those punks!",
            health: 0,
            money: 400,
            streetCredit: 30,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "You and your boys saw some punks slingin' on your corner! You beat some ass and jacked $200 off those punks!",
            health: 0,
            money: 200,
            streetCredit: 30,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Your baby mama took your ass to court for child support. Pay $500 to that ho",
            health: 0,
            money: -500,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCeIYhyjAYSrjnl0KT23PetTm_XCKFeDBzq9KjyeZLOGmHjcjQ0g"
        },
        {
            scenario: "While at a gas station a rival gang member shot at you. He didn't hit you but the cops showed up and found crack in your car. Pay $500 for bail.",
            health: 0,
            money: -500,
            streetCredit: 20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "While out at the club, you and yur boys spotted a rival gang member and jumped him in the bathroom. You made $500",
            health: 0,
            money: 500,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "One of your ho's got chlamydia, and the another is pregnant. Pay $500 for them to go to the clinic",
            health: 0,
            money: -500,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmaZwEkcyMicAIcWsOPV6N4clZxYBk2O3Y7lIzGjGKhKvE2n_A"
        },
        {
            scenario: "A rival gang did a drive by and shot you in the leg. ",
            health: -40,
            money: 0,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6DOiiI_lvLGYk05unvWfBl9YIn3PCHRY7YZVYIR_QzLG87cVZJw"
        },
        {
            scenario: "A rival gang did a drive by and shot your boy!",
            health: -40,
            money: 0,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6DOiiI_lvLGYk05unvWfBl9YIn3PCHRY7YZVYIR_QzLG87cVZJw"
        },
        {
            scenario: "Your rival gang hasn't been able to get any dope, your sales have been way up this week. You made an extra $500 this week! ",
            health: 0,
            money: 500,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Your rival gang hasn't been able to get any dope, your sales have been way up this week. You made an extra $500 this week! ",
            health: 0,
            money: 500,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Your whore house got raided, pay $500 to get them out of jail!",
            health: 0,
            money: -500,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AAvizxZgXEhSqcfRI4f3LWOpgHt3XsY7aYgQ2qR_u-D3OdGE",
        },
        {
            scenario: "Your stash house got robbed by a rival gang! They jacked $1000",
            health: 0,
            money: -1000,
            streetCredit: 20,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgcjFTpkUkS9X-aOeLfmcTE5gJxuw-1EKEzpwETtbyV2nQWrbb'
        },
        {
            scenario: "You got jumped and those guys got you for $500!",
            health: -85,
            money: -500,
            streetCredit: -100,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWX8MDpPSk3jWeiuFPM642Axathvt1D4RmSvlJ7onUJ1jJOQzI'
        },
        {
            scenario: "Your rival gang hasn't been able to get any dope, your sales have been way up this week. You made an extra $1000 this week! ",
            health: 0,
            money: 1000,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },

    ];

    // gets a random scenario to occur 
    function randomStuff() {
        $("#randomAction").hide();
        // shuffle the scenarios around
        shuffleArray(randomScenarios);
        // get the one off the end
        var currentScenario = randomScenarios.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
         $("#actionImage").show();
        // $('#modal1').modal('open');
        // get info to update
        health += Math.floor(currentScenario.health + ((defense + 5) / strength));
        money += currentScenario.money;
        streetCredit += currentScenario.streetCredit;
        // update display
        $("#health").text("Your Health: " + health);
        $("#money").text("You Have: $" + money);
        $("#streetCredit").text("Street Credit: " + streetCredit);
        // run the functions
        updateHealth();
        levelUp(); // set timeout to recur every few minutes
        setTimeout(randomStuff, 85000);
    }

    // call this function 
    // randomStuff();
    setTimeout(function() {
        randomStuff()
    }, 60000)


    // button to logout
    $(document).on("click", "#logout", function(event) {
        console.log("should be logging out");
        $.get("/logout", function(data) {
            window.location.href = '/login';
        });
    });


    // button to logout
    $(document).on("click", "#logout2", function(event) {
        console.log("should be logging out");
        $.get("/logout", function(data) {
            window.location.href = '/login';
        });
    });


});
