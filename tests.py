import unittest
from selenium import webdriver


class TwidderTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_open_twidder(self):
        driver = self.driver
        driver.get("http://127.0.0.1:5000")
        self.assertIn("Twidder", driver.title)

    def test_login(self):
        driver = self.driver
        driver.get("http://127.0.0.1:5000")
        email_elem = driver.find_element_by_id("email")
        psw_elem = driver.find_element_by_id("password")
        button_elem = driver.find_element_by_name("login")

        email_elem.send_keys("test@test.com")
        psw_elem.send_keys("password")
        button_elem.click()

        text = "Welcome to Twidder"
        self.assertTrue(text in driver.page_source)

    def test_browse(self):
        self.test_login()

        driver = self.driver
        browse_tab = driver.find_element_by_id("browse-tab")
        browse_tab.click()

        friend_pm_elem = driver.find_element_by_id("friend_pm")
        self.assertIsNotNone(friend_pm_elem)

    def test_account(self):
        self.test_login()

        driver = self.driver
        browse_tab = driver.find_element_by_id("account-tab")
        browse_tab.click()

        psw_old_elem = driver.find_element_by_id("psw_old")
        self.assertIsNotNone(psw_old_elem)

    def test_logout(self):
        self.test_account()

        driver = self.driver
        sign_out_elem = driver.find_element_by_id("sign-out")
        sign_out_elem.click()

        first_name_elem = driver.find_element_by_id("first_name")
        self.assertIsNotNone(first_name_elem)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()