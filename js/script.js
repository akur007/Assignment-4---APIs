$(document).ready(function() {
    // Function to add student ID and name dynamically
    function addStudentInfo() {
        const studentInfo = $("#student-info");
        const studentID = "200378937"; 
        const studentName = "Anoop Kuriakose"; 
        studentInfo.text("Student ID: " + studentID + ", Name: " + studentName);
    }

    // Call the function to add student info when the page loads
    addStudentInfo();

    // Fetch user data from GitHub API
    const username = 'akur007'; // Replace with the GitHub username you want to fetch
    const apiUrl = `https://api.github.com/users/${username}`;

    $.ajax({
        url: apiUrl,
        type: "GET",
        success: function(data) {
            // Display user data on the page
            displayUserInfo(data);
            displayRepositories(username);
            displayFollowing(username);
            displayActivity(username);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            // Display error message on the page
            const userInfo = $("#user-info");
            userInfo.append("<h2>Error:</h2>");
            userInfo.append("<p>Failed to fetch user data from the GitHub API.</p>");
        }
    });

    // Function to display user information
    function displayUserInfo(user) {
        const userInfo = $("#user-info");
        userInfo.append("<h2>User Information:</h2>");
        userInfo.append("<p><strong>Username:</strong> " + user.login + "</p>");
        userInfo.append("<p><strong>Name:</strong> " + (user.name ? user.name : "N/A") + "</p>");
        userInfo.append("<p><strong>Location:</strong> " + (user.location ? user.location : "N/A") + "</p>");
    }

    // Function to display repositories of the user
    function displayRepositories(username) {
        const repositories = $("#repositories");
        repositories.append("<h2>Repositories:</h2>");

        $.ajax({
            url: `https://api.github.com/users/${username}/repos`,
            type: "GET",
            success: function(data) {
                data.forEach(repo => {
                    repositories.append("<p><strong>Name:</strong> " + repo.name + "</p>");
                    repositories.append("<p><strong>Description:</strong> " + (repo.description ? repo.description : "N/A") + "</p>");
                    repositories.append("<p><strong>URL:</strong> <a href='" + repo.html_url + "' target='_blank'>" + repo.html_url + "</a></p>");
                    repositories.append("<hr>");
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                repositories.append("<p>Error fetching repositories.</p>");
            }
        });
    }

    // Function to display users the user is following
    function displayFollowing(username) {
        const following = $("#following");
        following.append("<h2>Following:</h2>");

        $.ajax({
            url: `https://api.github.com/users/${username}/following`,
            type: "GET",
            success: function(data) {
                if (data.length > 0) {
                    data.forEach(follow => {
                        following.append("<p><a href='" + follow.html_url + "' target='_blank'>" + follow.login + "</a></p>");
                    });
                } else {
                    following.append("<p>No users followed.</p>");
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                following.append("<p>Error fetching users followed.</p>");
            }
        });
    }

    // Function to display public activity of the user
    function displayActivity(username) {
        const activity = $("#activity");
        activity.append("<h2>Public Activity:</h2>");

        $.ajax({
            url: `https://api.github.com/users/${username}/events/public`,
            type: "GET",
            success: function(data) {
                if (data.length > 0) {
                    data.forEach(event => {
                        const eventType = event.type.replace(/([A-Z])/g, ' $1').trim(); // Convert camel case to words
                        activity.append("<p><strong>Type:</strong> " + eventType + "</p>");
                        activity.append("<p><strong>Date:</strong> " + event.created_at + "</p>");
                        activity.append("<hr>");
                    });
                } else {
                    activity.append("<p>No public activity found.</p>");
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                activity.append("<p>Error fetching public activity.</p>");
            }
        });
    }
});
