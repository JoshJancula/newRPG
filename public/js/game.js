$(document).ready(function() {

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


    // load the option buttons
    loadOptions();
    // get the data of current user
    $.get("api/user_data", {}, function(data) {}).done(function(data) {
        userId = data.id;
        $("#username").text(data.username);
        username = data.username;
        $("#health").text("Your Health: " + data.health);
        health = data.health;
        $("#strength").text(data.strength);
        strength = data.strength;
        $("#money").text("You Have: $" + data.money);
        money = data.money;
        $("#level").text("Level: " + data.level);
        level = data.level;
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
            // if (result.level <= level) {
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
            // $("#weaponsDiv").append(div);
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
            $.get("/api/users/" + userId, function(data) {
                console.log("data from saveWeapon", data);
                 $("#myGuns").empty();
                $("#myDrugs").empty();
                $("#myCars").empty();
                inventory = data.Weapons;
                // show em what they got
                getWeapons(inventory);
            });
        })
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


    ];

    showWeapons()
    // function to show the weapons for sale
    function showWeapons() {
        weapons.forEach(function(result) {
            // if (result.level <= level) {
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
        $("#message").text("You bought " + quantity + " " + name);
        $("#actionImage").attr('src', image)
        $('#modal1').modal('open');
        // update money display
        $("#money").text("You Have: $" + money);
        // if one already exists...
        if (doesExist === true) {
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
    $(document).on("click", "#completePurchase", function() {
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
            $("#message").text("You don't have enought $$$$$$$");
            $('#modal1').modal('open');
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
            // perform update based on doesExist value
            setTimeout(function() {
                performUpdate(k);
            }, 500)
        }
    });


    // possibilities for when when you click on a button
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
            scenario: "One of your girls got caught soliciting to a cop and snitched! Pay $600 to get you and your hoes outta jail.",
            health: 0,
            money: -600,
            streetCredit: -30,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AAvizxZgXEhSqcfRI4f3LWOpgHt3XsY7aYgQ2qR_u-D3OdGE"
        },
        {
            scenario: "Your bitches did good tonight! Made $700",
            health: 0,
            money: 500,
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
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 5,
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
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 5,
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
            money: 200,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "Deal Successfull! But somebody robbed one of your guys!!",
            health: 0,
            money: -100,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmoybOow9XsNXixlzQYm0JBJc3eXepNkr1nkc4n9xfWmgCPpZ5"
        },
        {
            scenario: "Deal Successfull! Count that paper!",
            health: 0,
            money: 100,
            streetCredit: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },

    ]



    // do a drive-by on some
    var driveBy = [ // punk mofos

        {
            scenario: "You hit 2 of their members and got a little cash, but your home-boy Reggie got shot!",
            money: 200,
            streetCredit: 10,
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
            streetCredit: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xfH-ij-CraeFOC9_mPVgqpWV33fw9_RAO7tqopU4_xzRUGlb"

        },
        {
            scenario: "You hit one but they shot back and you got hit, $500 for a doctor to keep it quiet",
            money: -500,
            health: -60,
            streetCredit: -30,
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
            scenario: "You got $600 but your home-boy Reggie got shot! You give him $300 to help with the medical bills",
            money: 300,
            streetCredit: 15,
            health: -50,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xfH-ij-CraeFOC9_mPVgqpWV33fw9_RAO7tqopU4_xzRUGlb"
        },
        {
            scenario: "You got busted by the cops! $150 for bail bro!",
            health: 0,
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
            scenario: "You got some stuff but also got bit by a pitt bull!",
            money: 150,
            health: -25,
            streetCredit: -10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb5YS3bhPdyxqp2x4a0N6GTFJQQEdqNOo1BsrYTUOg-Dd2ru_duQ"
        },

        {
            scenario: "Got yourself a flat screen TV and pawned it for $100!",
            health: 0,
            money: 200,
            streetCredit: 10,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPctm2un1ph8DhJcJhrbHzdwl94yzxUkdJeY4JZzXWzp-SyRSgSQ"
        },

    ];

    // possibilities for when 
    var robDealer = [ // you rob a dealer
        {
            scenario: "That mothaFucka shot you! Pay $500 for a doctor to keep it quiet.",
            health: -50,
            money: -500,
            streetCredit: 20,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6DOiiI_lvLGYk05unvWfBl9YIn3PCHRY7YZVYIR_QzLG87cVZJw"
        },
        {
            scenario: "You got $150 off that punk",
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

    // when you rob an innocent pedestrian
    var robPedestrian = [

        {
            scenario: "Got $40!",
            health: 0,
            money: 40,
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
            scenario: "Got $40!",
            health: 0,
            money: 40,
            streetCredit: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKvfzj2PEfKLYrG0nIGoTqBusvKe0lD_sHGG_uHqU9Hs8Uwp--"
        },
        {
            scenario: "An off duty officer shot you! Pay $400 in bail and hospital fees",
            health: -50,
            streetCredit: 20,
            money: -400,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
    ]


    // create buttons to trigger all these scenarios
    function loadOptions() {
        var optionValue = ["robPedestrian", "robDealer", "BE", "driveBy", "sellCrack", "sellWeed", "pimp"];
        var options = ["Rob Pedestrian", "Rob a Dealer", "Do a B&E", "Drive-By Shooting", "Sell Crack", "Sell Weed", "Pimp Hoes"]
        for (var i = 0; i < options.length; i++) {
            var div = $("<button value='" + i + "' class='btn optionButtons col l0 s10 push-s1'>");
            div.attr("id", optionValue[i]);
            div.text(JSON.stringify(options[i]));
            $("#optionButtons").append(div);
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
                $('#modal1').modal('open');
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
            $('#modal1').modal('open');
        }
    }


    // when you click on saveGame
    $(document).on("click", "#saveGame", function() {
        let info = {
            username: username,
            health: health,
            defense: defense,
            strength: strength,
            money: money,
            level: level,
            streetCredit: streetCredit,
        } // update your character
        $("#actionImage").hide();
        $("#message").text("Save Successfull");
        $('#modal1').modal('open');
        updateUser(info);
    });

    // when you click on rob pedestrian
    $(document).on("click", "#robPedestrian", function() {
        $("#actionImage").show();
        // shuffle the scenarios around
        shuffleArray(robPedestrian);
        // get the one off the end
        var currentScenario = robPedestrian.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $('#modal1').modal('open');
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
        $("#actionImage").show();
        // shuffle the scenarios around
        shuffleArray(robDealer);
        // get the one off the end
        var currentScenario = robDealer.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $('#modal1').modal('open');
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
        $("#actionImage").show();
        // shuffle the scenarios around
        shuffleArray(BE);
        // get the one off the end
        var currentScenario = BE.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $('#modal1').modal('open');
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


    // when you click on do a drive-by
    $(document).on("click", "#driveBy", function() {
        var k = $(this).attr("value");
        checkInventory(k)
        if (hasCar == true) {
            $("#actionImage").show();
            // shuffle the scenarios around
            shuffleArray(driveBy);
            // get the one off the end
            var currentScenario = driveBy.slice(-1)[0];
            // tell them what happened
            console.log(driveBy[0].image)
            $("#actionImage").attr('src', driveBy[0].image);
            $("#message").text(currentScenario.scenario);
            $('#modal1').modal('open');
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

            $("#message").text("You have to own a car to do a drive-by!");
            $('#modal1').modal('open');
        }
    });

    // when you click on sell crack
    $(document).on("click", "#sellCrack", function() {
        var k = $(this).attr("value");
        console.log("K at the beggining of sellCrack: " + k)
        // check inventory
        checkInventory(k);
        if (doesExist == false || oldQ < 1) {
            // they don't have any to sell
            $("#actionImage").attr('src', weapons[k].image);
            $("#message").text("You don't have any crack to sell!");
            $('#modal1').modal('open');
        }
        else { // update the inventory
            let newQ = (oldQ - 1);
            let newInventory = {
                quantity: newQ,
            } // update the inventory 
            inventoryUpdate(newInventory, weaponId);
            $("#actionImage").show();
            // shuffle the scenarios around
            shuffleArray(sellCrack);
            // get the one off the end
            var currentScenario = sellCrack.slice(-1)[0];
            // tell them what happened
            $("#actionImage").attr('src', currentScenario.image);
            $("#message").text(currentScenario.scenario);
            $('#modal1').modal('open');
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
        var k = $(this).attr("value");
        console.log("K at the beggining of sellWeed: " + k)
        // check inventory
        checkInventory(k);
        if (doesExist == false || oldQ < 1) {
            // they don't have any to sell
            $("#actionImage").attr('src', weapons[k].image);
            $("#message").text("You don't have any weed to sell!");
            $('#modal1').modal('open');
        }
        else { // update the inventory
            let newQ = (oldQ - 1);
            let newInventory = {
                quantity: newQ,
            } // update the inventory 
            inventoryUpdate(newInventory, weaponId);
            $("#actionImage").show();
            // shuffle the scenarios around
            shuffleArray(sellWeed);
            // get the one off the end
            var currentScenario = sellWeed.slice(-1)[0];
            // tell them what happened
            $("#actionImage").attr('src', currentScenario.image);
            $("#message").text(currentScenario.scenario);
            $('#modal1').modal('open');
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
        $("#actionImage").show();
        // shuffle the scenarios around
        shuffleArray(pimp);
        // get the one off the end
        var currentScenario = pimp.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $('#modal1').modal('open');
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
            scenario: "While out at the club, you and yur boys spotted a rival gang member and jump him in the bathroom. You made $500",
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
            scenario: "Your rival gang hasn't been able to get any dope, your sales have been way up this week. You made an extra $500 this week! ",
            health: 0,
            money: 40,
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
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Du22ozTWTIQ4yvdrCUgKYiii8wCvoaQMwZqfOO44EM_Q09o_ig'
        },
        {
            scenario: "You got jumped and those guys got you for $500!",
            health: -85,
            money: -500,
            streetCredit: -100,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWX8MDpPSk3jWeiuFPM642Axathvt1D4RmSvlJ7onUJ1jJOQzI'
        },

    ];

    // gets a random scenario to occur 
    function randomStuff() {
        $("#actionImage").show();
        // shuffle the scenarios around
        shuffleArray(randomScenarios);
        // get the one off the end
        var currentScenario = randomScenarios.slice(-1)[0];
        // tell them what happened
        $("#actionImage").attr('src', currentScenario.image);
        $("#message").text(currentScenario.scenario);
        $('#modal1').modal('open');
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
    randomStuff();





});
