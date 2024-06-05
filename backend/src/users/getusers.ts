import key from './keycloak.json';

console.log("Keycloak config:", key);  // Debug log

async function getusers() {
    let myHeaders, urlencoded, response, requestOptions, result;

    // Ensure key contains the correct values
    if (!key || !key['auth-server-url']) {
        throw new Error("Keycloak configuration is missing or incorrect");
    }

    myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "admin-cli");
    urlencoded.append("username", "admin");
    urlencoded.append("password", "admin");

    requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    response = await fetch(`${key['auth-server-url']}/realms/master/protocol/openid-connect/token`, requestOptions);
    try {
        result = await response.json();
    } catch {
        return { 'status': 'error', 'phase': 'login', 'data': response };
    }

    myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${result.access_token}`);

    requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    response = await fetch(`${key['auth-server-url']}/admin/realms/Fuel-Link/users`, requestOptions);
    try {
        result = await response.json();
        return { 'status': 'success', 'data': result };
    } catch {
        return { 'status': 'error', 'phase': 'users', 'data': response };
    }
}

export { getusers };
