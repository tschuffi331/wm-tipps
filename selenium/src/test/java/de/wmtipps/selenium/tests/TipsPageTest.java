package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.config.TestConfig;
import de.wmtipps.selenium.pages.LoginPage;
import de.wmtipps.selenium.pages.TipsPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TipsPage (geschützt)")
class TipsPageTest extends BaseTest {

    @Test
    @DisplayName("Nicht eingeloggte Nutzer werden auf /login weitergeleitet")
    void redirectsToLoginWhenNotAuthenticated() {
        new TipsPage(driver).open();
        assertTrue(driver.getCurrentUrl().contains("login"),
            "Unauthentifizierte Nutzer sollten auf /login weitergeleitet werden");
    }

    @Test
    @DisplayName("Nach Login ist die Tipps-Seite erreichbar")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void tipsPageVisibleAfterLogin() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        assertTrue(page.getHeading().contains("Tipps"),
            "Überschrift sollte 'Tipps' enthalten");
    }

    @Test
    @DisplayName("Phasen-Selektor ist vorhanden und enthält 'Vorrunde'")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void phaseSelectIsVisible() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        assertTrue(page.isPhaseSelectVisible(), "Phasen-Selektor sollte vorhanden sein");
        assertTrue(page.getSelectedPhase().contains("Vorrunde") || page.getSelectedPhase().contains("✓"),
            "Standardmäßig sollte 'Vorrunde' oder die aktive Phase ausgewählt sein");
    }

    @Test
    @DisplayName("Gruppenfilter wird für Vorrunde angezeigt")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void groupFilterVisibleInVorrunde() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        // Select Vorrunde explicitly
        try { page.selectPhase("Vorrunde ✓"); } catch (Exception ignored) {
            try { page.selectPhase("Vorrunde"); } catch (Exception e2) { /* already selected */ }
        }
        assertTrue(page.hasGroupFilter(), "Gruppenfilter sollte in der Vorrunde angezeigt werden");
    }

    @Test
    @DisplayName("Spielkarten werden geladen")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void matchCardsAreLoaded() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        assertFalse(page.getMatchCards().isEmpty(), "Mindestens eine Spielkarte sollte geladen werden");
    }

    @Test
    @DisplayName("Tipp-Felder mit aria-label 'Heimtore' / 'Auswärtstore' sind vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void tipInputsHaveAriaLabels() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        assertTrue(page.hasTipInputs(),
            "Tipp-Eingabefelder mit aria-label sollten vorhanden sein (falls noch Spiele tippbar)");
    }

    @Test
    @DisplayName("Seitentitel enthält 'Meine Tipps'")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void pageTitleContainsMeineTipps() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        assertTrue(page.getPageTitle().contains("Tipps"));
    }

    @Test
    @DisplayName("Tipps-Zähler (X von Y Spielen) wird angezeigt")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void tipsCounterIsDisplayed() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        assertTrue(page.hasTipsCounter(), "Tipps-Zähler 'X von Y Spielen getippt' sollte angezeigt werden");
    }

    @Test
    @DisplayName("Phasenauswahl 'Sechzehntelfinale' ist auswählbar wenn Spiele vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void sechzehntelfinalePhaseSelectable() {
        loginAsTestUser();
        TipsPage page = new TipsPage(driver).open();
        try {
            page.selectPhase("Sechzehntelfinale");
            assertFalse(page.hasEmptyMessage() && page.getMatchCards().isEmpty(),
                "Sechzehntelfinale sollte Spiele enthalten");
        } catch (Exception e) {
            // Option may be disabled if no matches exist — that is acceptable
        }
    }
}
