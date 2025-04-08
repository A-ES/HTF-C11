import os
import sys
import numpy as np
import pandas as pd
from dataclasses import dataclass
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

from src.mlproject.logger import logging
from src.mlproject.exception import CustomException
from src.mlproject.utils import save_object


@dataclass
class DataTransformationConfig:
    preprocessor_obj_file_path = os.path.join('artifacts', 'preprocessor.pkl')


class DataTransformation:
    def __init__(self):
        self.data_transformation_config = DataTransformationConfig()

    def get_data_transformer_object(self):
        try:
            numerical_columns = [
                'ProjectSize(sqm)', 'Duration(days)', 'Temperature(C)',
                'Rainfall(mm)', 'WindSpeed(km/h)', 'MaterialQuantity(tons)',
                'EquipmentHours', 'LaborHoursPlanned', 'SupplyLeadTime(days)',
                'SeasonalFactor', 'LaborHoursActual',
                'MaterialCarbonEmission', 'EquipmentCarbonEmission'
            ]

            categorical_columns = [
                'ProjectType', 'WeatherCondition', 'MaterialType', 'EquipmentType'
            ]

            num_pipeline = Pipeline(steps=[
                ("imputer", SimpleImputer(strategy='median')),
                ("scaler", StandardScaler())
            ])

            cat_pipeline = Pipeline(steps=[
                ("imputer", SimpleImputer(strategy='most_frequent')),
                ("onehot", OneHotEncoder(handle_unknown='ignore', sparse=False))
            ])

            preprocessor = ColumnTransformer(transformers=[
                ("num_pipeline", num_pipeline, numerical_columns),
                ("cat_pipeline", cat_pipeline, categorical_columns)
            ])

            logging.info("Preprocessor pipeline created successfully.")
            return preprocessor

        except Exception as e:
            raise CustomException(e, sys)

    def initiate_data_transformation(self, train_path, test_path):
        try:
            train_df = pd.read_csv(train_path)
            test_df = pd.read_csv(test_path)

            logging.info("Train and test data loaded successfully.")

            preprocessing_obj = self.get_data_transformer_object()

            target_column_name = "TotalCarbonEmission"

            drop_columns = ["ProjectID", "PlannedStartDate"]  # Drop irrelevant or date ID columns

            X_train = train_df.drop(columns=[target_column_name] + drop_columns)
            y_train = train_df[target_column_name]

            X_test = test_df.drop(columns=[target_column_name] + drop_columns)
            y_test = test_df[target_column_name]

            X_train_transformed = preprocessing_obj.fit_transform(X_train)
            X_test_transformed = preprocessing_obj.transform(X_test)

            train_arr = np.c_[X_train_transformed, y_train]
            test_arr = np.c_[X_test_transformed, y_test]

            save_object(
                file_path=self.data_transformation_config.preprocessor_obj_file_path,
                obj=preprocessing_obj
            )

            logging.info("Preprocessor object saved and data transformed.")
            return train_arr, test_arr, self.data_transformation_config.preprocessor_obj_file_path

        except Exception as e:
            raise CustomException(e, sys)
