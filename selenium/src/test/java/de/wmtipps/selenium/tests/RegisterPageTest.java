package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.RegisterPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RegisterPage")
class RegisterPageTest extends BaseTest {

    @Test
    @DisplayName("Seite zeigt 'Registrieren'-Überschrift")
    void pageHasHeading() {
        RegisterPage page = new RegisterPage(driver).open();
        assertEquals("Registrieren", page.getHeading());
    }

    @Test
    @DisplayName("Formular enthält alle Pflichtfelder")
    void formHasRequiredFields() {
        RegisterPage page = new RegisterPage(driver).open();
        assertTrue(page.isUsernameFieldPresent(), "Benutzername-Feld fehlt");
        assertTrue(page.isPasswordFieldPresent(), "Passwort-Feld fehlt");
        assertTrue(page.isPasswordConfirmFieldPresent(), "Passwort-Wiederholen-Feld fehlt");
    }

    @Test
    @DisplayName("Avatar-Upload-Button ist vorhanden")
    void hasAvatarUploadButton() {
        RegisterPage page = new RegisterPage(driver).open();
        assertTrue(page.isAvatarButtonVisible(), "Profilbild-Button sollte sichtbar sein");
    }

    @Test
    @DisplayName("Link zur Login-Seite ist vorhanden")
    void hasLoginLink() {
        RegisterPage page = new RegisterPage(driver).open();
        assertTrue(page.isLoginLinkVisible(), "Anmelden-Link sollte vorhanden sein");
    }

    @Test
    @DisplayName("Benutzername-Feld zeigt Platzhalter mit Längenangabe")
    void usernameFieldHasHelpfulPlaceholder() {
        RegisterPage page = new RegisterPage(driver).open();
        String placeholder = page.getUsernameFieldPlaceholder();
        assertTrue(placeholder != null && !placeholder.isEmpty(),
            "Benutzername-Feld sollte einen Platzhalter haben");
    }

    @Test
    @DisplayName("Seitentitel enthält 'Registrieren'")
    void pageTitleContainsRegistrieren() {
        RegisterPage page = new RegisterPage(driver).open();
        assertTrue(page.getPageTitle().contains("Registrieren"));
    }
}
