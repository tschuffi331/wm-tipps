package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private static final By HEADING       = By.cssSelector("h1");
    private static final By USERNAME_FIELD = By.id("login-username");
    private static final By PASSWORD_FIELD = By.id("login-password");
    private static final By SUBMIT_BTN    = By.cssSelector("button[type='submit']");
    private static final By REGISTER_LINK = By.xpath("//a[contains(@href,'register')]");
    private static final By TOAST         = By.cssSelector("[class*='toast'], [class*='Toaster'] > *");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage open() {
        navigate("/login");
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

    public LoginPage fillUsername(String username) {
        waitVisible(USERNAME_FIELD).sendKeys(username);
        return this;
    }

    public LoginPage fillPassword(String password) {
        waitVisible(PASSWORD_FIELD).sendKeys(password);
        return this;
    }

    public void submit() {
        waitClickable(SUBMIT_BTN).click();
    }

    public boolean isSubmitEnabled() {
        return waitVisible(SUBMIT_BTN).isEnabled();
    }

    public String getUsernameLabel() {
        return driver.findElement(By.cssSelector("label[for='login-username']")).getText();
    }

    public String getPasswordLabel() {
        return driver.findElement(By.cssSelector("label[for='login-password']")).getText();
    }

    public boolean isRegisterLinkVisible() {
        return isPresent(REGISTER_LINK);
    }

    /** Logs in and waits for the URL to change away from /login */
    public void loginAs(String username, String password) {
        open();
        fillUsername(username);
        fillPassword(password);
        submit();
        wait.until(d -> !d.getCurrentUrl().contains("login"));
    }
}
