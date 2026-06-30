package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProfilePage extends BasePage {

    private static final By HEADING          = By.cssSelector("h1");
    private static final By LOGOUT_BTN       = By.xpath("//button[contains(text(),'Abmelden')]");
    private static final By AVATAR_UPLOAD_BTN = By.xpath("//button[contains(text(),'Profilbild')]");
    private static final By USERNAME_DISPLAY = By.cssSelector("h2");
    private static final By PW_TOGGLE        = By.xpath("//button[contains(text(),'Passwort ändern')]");
    private static final By PW_CURRENT       = By.id("pw-current");
    private static final By PW_NEW           = By.id("pw-new");
    private static final By PW_CONFIRM       = By.id("pw-confirm");
    private static final By PW_SAVE_BTN      = By.xpath("//button[contains(text(),'Passwort speichern')]");

    public ProfilePage(WebDriver driver) {
        super(driver);
    }

    public ProfilePage open() {
        navigate("/profile");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public String getDisplayedUsername() {
        return waitVisible(USERNAME_DISPLAY).getText();
    }

    public boolean isLogoutButtonVisible() {
        return isPresent(LOGOUT_BTN);
    }

    public boolean isAvatarUploadVisible() {
        return isPresent(AVATAR_UPLOAD_BTN);
    }

    public boolean isPasswordSectionVisible() {
        return isPresent(PW_TOGGLE);
    }

    public ProfilePage openPasswordSection() {
        waitClickable(PW_TOGGLE).click();
        waitVisible(PW_CURRENT);
        return this;
    }

    public boolean isPasswordFormVisible() {
        return isPresent(PW_CURRENT);
    }

    public void clickLogout() {
        waitClickable(LOGOUT_BTN).click();
    }

    public void fillPasswordChange(String current, String newPw, String confirm) {
        waitVisible(PW_CURRENT).sendKeys(current);
        driver.findElement(PW_NEW).sendKeys(newPw);
        driver.findElement(PW_CONFIRM).sendKeys(confirm);
        driver.findElement(PW_SAVE_BTN).click();
    }
}
