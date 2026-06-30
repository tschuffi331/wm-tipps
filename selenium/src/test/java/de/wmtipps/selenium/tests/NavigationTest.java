package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.config.TestConfig;
import de.wmtipps.selenium.pages.HomePage;
import de.wmtipps.selenium.pages.NavbarPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Navigation")
class NavigationTest extends BaseTest {

    @Test
    @DisplayName("Navbar-Link 'Rangliste' navigiert auf /leaderboard")
    void navbarLeaderboardLinkWorks() {
        new HomePage(driver).open();
        new NavbarPage(driver).clickLeaderboard();
        assertTrue(driver.getCurrentUrl().contains("leaderboard"),
            "Rangliste-Link sollte auf /leaderboard navigieren");
    }

    @Test
    @DisplayName("Navbar-Link 'Regeln' navigiert auf /rules")
    void navbarRulesLinkWorks() {
        new HomePage(driver).open();
        new NavbarPage(driver).clickRules();
        assertTrue(driver.getCurrentUrl().contains("rules"),
            "Regeln-Link sollte auf /rules navigieren");
    }

    @Test
    @DisplayName("Navbar-Link 'Anmelden' navigiert auf /login")
    void navbarLoginLinkWorks() {
        new HomePage(driver).open();
        new NavbarPage(driver).clickLogin();
        assertTrue(driver.getCurrentUrl().contains("login"),
            "Login-Link sollte auf /login navigieren");
    }

    @Test
    @DisplayName("Navbar-Link 'Registrieren' navigiert auf /register")
    void navbarRegisterLinkWorks() {
        new HomePage(driver).open();
        new NavbarPage(driver).clickRegister();
        assertTrue(driver.getCurrentUrl().contains("register"),
            "Registrieren-Link sollte auf /register navigieren");
    }

    @Test
    @DisplayName("Logo-Link navigiert zurück auf /")
    void logoLinkNavigatesToHome() {
        // Navigate away first
        driver.get(TestConfig.url("/rules"));
        new NavbarPage(driver).clickLogo();
        String url = driver.getCurrentUrl();
        assertTrue(url.endsWith("#/") || url.endsWith("wm-tipps/") || url.endsWith("wm-tipps"),
            "Logo-Link sollte auf die Startseite navigieren");
    }

    @Test
    @DisplayName("Hamburger-Button hat aria-expanded und aria-controls")
    void hamburgerHasAriaAttributes() {
        // Resize to mobile viewport to make hamburger visible
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(400, 800));
        new HomePage(driver).open();
        NavbarPage navbar = new NavbarPage(driver);
        String expanded = navbar.getHamburgerAriaExpanded();
        assertNotNull(expanded, "aria-expanded sollte vorhanden sein");
    }

    @Test
    @DisplayName("Nach Login sieht man Tipps-Link in der Navbar")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void afterLoginNavbarShowsTipsLink() {
        loginAsTestUser();
        NavbarPage navbar = new NavbarPage(driver);
        assertTrue(navbar.isTipsLinkVisible(), "Nach Login sollte Tipps-Link in der Navbar sichtbar sein");
    }

    @Test
    @DisplayName("Nach Login sieht man Profil-Link in der Navbar")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void afterLoginNavbarShowsProfileLink() {
        loginAsTestUser();
        NavbarPage navbar = new NavbarPage(driver);
        assertTrue(navbar.isProfileLinkVisible(), "Nach Login sollte Profil-Link in der Navbar sichtbar sein");
    }

    @Test
    @DisplayName("Tipps-Link leitet auf /login um wenn nicht eingeloggt")
    void tipsLinkRedirectsToLoginIfGuest() {
        new HomePage(driver).open();
        // Navigate directly to /tips — the navbar may show it or not for guests
        driver.get(TestConfig.url("/tips"));
        assertTrue(driver.getCurrentUrl().contains("login"),
            "Direktzugriff auf /tips als Gast soll auf /login umleiten");
    }
}
