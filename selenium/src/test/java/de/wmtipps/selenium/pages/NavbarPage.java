package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class NavbarPage extends BasePage {

    private static final By NAV_LEADERBOARD = By.cssSelector("nav a[href='#/leaderboard'], a[href*='leaderboard']");
    private static final By NAV_RULES       = By.cssSelector("nav a[href='#/rules'], a[href*='rules']");
    private static final By NAV_LOGIN       = By.cssSelector("a[href='#/login'], a[href*='login']:not([href*='register'])");
    private static final By NAV_REGISTER    = By.cssSelector("a[href='#/register'], a[href*='register']");
    private static final By NAV_TIPS        = By.cssSelector("a[href='#/tips'], a[href*='tips']");
    private static final By NAV_GROUPS      = By.cssSelector("a[href='#/groups'], a[href*='groups']");
    private static final By NAV_PROFILE     = By.cssSelector("a[href='#/profile'], a[href*='profile']");
    private static final By HAMBURGER       = By.cssSelector("button[aria-label='Menü']");
    private static final By MOBILE_MENU     = By.id("mobile-menu");
    private static final By LOGO_LINK       = By.cssSelector("nav a[href='#/'], a[href='#/']");

    public NavbarPage(WebDriver driver) {
        super(driver);
    }

    public boolean isLeaderboardLinkVisible() {
        return isPresent(NAV_LEADERBOARD);
    }

    public boolean isRulesLinkVisible() {
        return isPresent(NAV_RULES);
    }

    public boolean isLoginLinkVisible() {
        return isPresent(NAV_LOGIN);
    }

    public boolean isRegisterLinkVisible() {
        return isPresent(NAV_REGISTER);
    }

    public boolean isTipsLinkVisible() {
        return isPresent(NAV_TIPS);
    }

    public boolean isProfileLinkVisible() {
        return isPresent(NAV_PROFILE);
    }

    public void clickLeaderboard() {
        waitClickable(NAV_LEADERBOARD).click();
    }

    public void clickRules() {
        waitClickable(NAV_RULES).click();
    }

    public void clickLogin() {
        waitClickable(NAV_LOGIN).click();
    }

    public void clickRegister() {
        waitClickable(NAV_REGISTER).click();
    }

    public void clickTips() {
        waitClickable(NAV_TIPS).click();
    }

    public void clickGroups() {
        waitClickable(NAV_GROUPS).click();
    }

    public void clickProfile() {
        waitClickable(NAV_PROFILE).click();
    }

    public void clickLogo() {
        waitClickable(LOGO_LINK).click();
    }

    /** Opens the mobile hamburger menu (if the viewport is narrow). */
    public void openMobileMenu() {
        WebElement btn = waitClickable(HAMBURGER);
        btn.click();
        waitVisible(MOBILE_MENU);
    }

    public boolean isMobileMenuOpen() {
        return isPresent(MOBILE_MENU);
    }

    public String getHamburgerAriaExpanded() {
        return driver.findElement(HAMBURGER).getAttribute("aria-expanded");
    }
}
