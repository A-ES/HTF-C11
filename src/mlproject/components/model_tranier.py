import os
import sys
from dataclasses import dataclass
import numpy as np
from sklearn.ensemble import (
    AdaBoostRegressor,
    GradientBoostingRegressor,
    RandomForestRegressor,
)
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from xgboost import XGBRegressor
from sklearn.metrics import r2_score

from src.mlproject.exception import CustomException
from src.mlproject.logger import logging
from src.mlproject.utlis import save_object, evaluate_models


@dataclass
class ModelTrainerConfig:
    trained_model_file_path = os.path.join("artifacts", "model.pkl")


class ModelTrainer:
    def __init__(self):
        self.model_trainer_config = ModelTrainerConfig()

    def initiate_model_trainer(self, train_array, test_array):
        try:
            logging.info("Splitting training and test arrays into features and target...")

            X_train, y_train = train_array[:, :-1], train_array[:, -1]
            X_test, y_test = test_array[:, :-1], test_array[:, -1]

            models = {
                "Random Forest": RandomForestRegressor(),
                "Decision Tree": DecisionTreeRegressor(),
                "Gradient Boosting": GradientBoostingRegressor(),
                "Linear Regression": LinearRegression(),
                "XGBRegressor": XGBRegressor(),
                "AdaBoost Regressor": AdaBoostRegressor(),
            }

            params = {
                "Decision Tree": {
                    'criterion': ['squared_error', 'friedman_mse', 'absolute_error', 'poisson'],
                },
                "Random Forest": {
                    'n_estimators': [50, 100, 150]
                },
                "Gradient Boosting": {
                    'learning_rate': [0.1, 0.05],
                    'subsample': [0.8, 0.9],
                    'n_estimators': [100, 150]
                },
                "Linear Regression": {},
                "XGBRegressor": {
                    'learning_rate': [0.1, 0.05],
                    'n_estimators': [100, 150]
                },
                "AdaBoost Regressor": {
                    'learning_rate': [0.1, 0.05],
                    'n_estimators': [50, 100]
                }
            }

            model_report: dict = evaluate_models(X_train, y_train, X_test, y_test, models, params)

            best_model_score = max(model_report.values())
            best_model_name = max(model_report, key=model_report.get)
            best_model = models[best_model_name]

            logging.info(f"Best Model Found: {best_model_name} with R² Score: {best_model_score}")

            if best_model_score < 0.01:
                logging.warning("Model performance is too low. R² < 0.01")

            save_object(
                file_path=self.model_trainer_config.trained_model_file_path,
                obj=best_model
            )

            # Fit best model on training data
            best_model.fit(X_train, y_train)

            predictions = best_model.predict(X_test)
            r2_square = r2_score(y_test, predictions)

            return r2_square

        except Exception as e:
            raise CustomException(e, sys)
