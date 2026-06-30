package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class NotFoundPage extends BasePage {

    private static final By HEADING      = By.cssSelector("h1");
    private static final By HOME_LINK    = By.xpath("//a[contains(text(),'Startseite')]");
    private static final By OFFSIDE_MSG  = By.xpath("//*[contains(text(),'Abseits') or contains(text(),'nicht gefunden')]");

    public NotFoundPage(WebDriver driver) {
        super(driver);
    }

    public NotFoundPage open() {
        navigate("/this-page-does-not-exist-42");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public boolean hasHomeLink() {
        return isPresent(HOME_LINK);
    }

    public boolean hasHumourousMessage() {
        return isPresent(OFFSIDE_MSG);
    }

    public void clickHomeLink() {
        waitClickable(HOME_LINK).click();
    }
}
