package de.wmtipps.selenium.config;

public final class TestConfig {
    public static final String BASE_URL        = prop("BASE_URL",       "https://tschuffi331.github.io/wm-tipps");
    public static final String TEST_USERNAME   = prop("TEST_USERNAME",  "");
    public static final String TEST_PASSWORD   = prop("TEST_PASSWORD",  "");
    public static final String ADMIN_USERNAME  = prop("ADMIN_USERNAME", "");
    public static final String ADMIN_PASSWORD  = prop("ADMIN_PASSWORD", "");
    public static final boolean HEADLESS       = Boolean.parseBoolean(prop("HEADLESS", "true"));
    public static final int TIMEOUT_SECONDS    = Integer.parseInt(prop("TIMEOUT_SECONDS", "15"));

    private TestConfig() {}

    private static String prop(String key, String defaultValue) {
        String v = System.getProperty(key);
        return (v != null && !v.isEmpty()) ? v : defaultValue;
    }

    public static boolean hasTestCredentials() {
        return !TEST_USERNAME.isEmpty() && !TEST_PASSWORD.isEmpty();
    }

    public static boolean hasAdminCredentials() {
        return !ADMIN_USERNAME.isEmpty() && !ADMIN_PASSWORD.isEmpty();
    }

    /** Full URL for a hash-router path, e.g. page("/login") → base/#/login */
    public static String url(String hashPath) {
        return BASE_URL + "/#" + hashPath;
    }
}
