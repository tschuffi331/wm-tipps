package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage extends BasePage {

    private static final By HEADING         = By.cssSelector("h1");
    private static final By USERNAME_FIELD  = By.id("reg-username");
    private static final By PASSWORD_FIELD  = By.id("reg-password");
    private static final By PASSWORD2_FIELD = By.id("reg-password2");
    private static final By SUBMIT_BTN      = By.cssSelector("button[type='submit']");
    private static final By AVATAR_BTN      = By.xpath("//button[contains(text(),'Profilbild')]");
    private static final By LOGIN_LINK      = By.xpath("//a[contains(@href,'login') and not(contains(@href,'register'))]");

    public RegisterPage(WebDriver driver) {
        super(driver);
    }

    public RegisterPage open() {
        navigate("/register");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public boolean isUsernameFieldPresent() {
        return isPresent(USERNAME_FIELD);
    }

    public boolean isPasswordFieldPresent() {
        return isPresent(PASSWORD_FIELD);
    }

    public boolean isPasswordConfirmFieldPresent() {
        return isPresent(PASSWORD2_FIELD);
    }

    public RegisterPage fillUsername(String username) {
        waitVisible(USERNAME_FIELD).sendKeys(username);
        return this;
    }

    public RegisterPage fillPassword(String password) {
        waitVisible(PASSWORD_FIELD).sendKeys(password);
        return this;
    }

    public RegisterPage fillPasswordConfirm(String password) {
        waitVisible(PASSWORD2_FIELD).sendKeys(password);
        return this;
    }

    public void submit() {
        waitClickable(SUBMIT_BTN).click();
    }

    public boolean isAvatarButtonVisible() {
        return isPresent(AVATAR_BTN);
    }

    public boolean isLoginLinkVisible() {
        return isPresent(LOGIN_LINK);
    }

    public String getUsernameFieldPlaceholder() {
        return driver.findElement(USERNAME_FIELD).getAttribute("placeholder");
    }
}
