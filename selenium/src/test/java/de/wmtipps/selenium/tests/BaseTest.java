package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.config.DriverFactory;
import de.wmtipps.selenium.pages.LoginPage;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;

import static de.wmtipps.selenium.config.TestConfig.*;

public abstract class BaseTest {

    protected WebDriver driver;

    @BeforeEach
    void setUp() {
        driver = DriverFactory.createDriver();
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /** Logs in as the configured regular test user. Skips if credentials are not set. */
    protected void loginAsTestUser() {
        if (!hasTestCredentials()) {
            throw new org.openqa.selenium.WebDriverException(
                "TEST_USERNAME / TEST_PASSWORD not configured — skipping auth test"
            );
        }
        new LoginPage(driver).loginAs(TEST_USERNAME, TEST_PASSWORD);
    }

    /** Logs in as the configured admin user. Skips if credentials are not set. */
    protected void loginAsAdmin() {
        if (!hasAdminCredentials()) {
            throw new org.openqa.selenium.WebDriverException(
                "ADMIN_USERNAME / ADMIN_PASSWORD not configured — skipping admin test"
            );
        }
        new LoginPage(driver).loginAs(ADMIN_USERNAME, ADMIN_PASSWORD);
    }
}
